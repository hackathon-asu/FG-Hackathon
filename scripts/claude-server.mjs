#!/usr/bin/env node

/**
 * Claude Code API Server
 *
 * Ollama-style local server that wraps Claude Code CLI.
 * Spins up an HTTP server, accepts prompts, runs them through
 * Claude Code (Opus), and returns the response.
 *
 * Supports both non-streaming and SSE streaming (OpenAI-compatible)
 * so it works with Vercel AI SDK's streamText().
 *
 * Usage:
 *   node scripts/claude-server.mjs                    # start server on :4321
 *   node scripts/claude-server.mjs --port 8080        # custom port
 *   node scripts/claude-server.mjs --model sonnet     # use sonnet instead
 *
 * API:
 *   POST /v1/chat/completions   — OpenAI-compatible (streaming + non-streaming)
 *   POST /v1/responses          — OpenAI Responses API compatible
 *   POST /api/generate          — Ollama-compatible endpoint
 *   GET  /v1/models             — list available models
 *   GET  /health                — health check
 */

import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

// --- Config ---
const args = process.argv.slice(2)
const PORT = getArg('--port', '4321')
const MODEL = getArg('--model', 'opus')
const CLAUDE_BIN = getArg('--claude-bin', findClaude())
const MAX_TIMEOUT = parseInt(getArg('--timeout', '300000')) // 5 min default

function getArg(flag, fallback) {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback
}

function findClaude() {
  return resolve(process.env.HOME, '.local/bin/claude')
}

// --- Run Claude Code (returns full result) ---
function runClaude(prompt, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const model = options.model || MODEL
    const systemPrompt = options.systemPrompt || ''

    const cliArgs = [
      '--print',
      '--output-format', 'json',
      '--model', model,
      '--no-session-persistence',
    ]

    if (systemPrompt) {
      cliArgs.push('--system-prompt', systemPrompt)
    }

    cliArgs.push(prompt)

    const child = spawn(CLAUDE_BIN, cliArgs, {
      timeout: MAX_TIMEOUT,
      env: { ...process.env },
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    child.stdin.end()

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (d) => { stdout += d.toString() })
    child.stderr.on('data', (d) => { stderr += d.toString() })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Claude exited with code ${code}: ${stderr || stdout}`))
        return
      }
      try {
        const parsed = JSON.parse(stdout)
        const text = parsed.result || parsed.content || stdout
        resolvePromise({
          text: typeof text === 'string' ? text : JSON.stringify(text),
          raw: parsed,
          model: `claude-code-${model}`,
        })
      } catch {
        resolvePromise({ text: stdout.trim(), raw: null, model: `claude-code-${model}` })
      }
    })

    child.on('error', (err) => {
      reject(new Error(`Failed to spawn claude: ${err.message}`))
    })
  })
}

// --- Stream response as SSE chunks ---
// Gets full response from Claude, then emits as word-level SSE chunks.
async function streamClaude(prompt, options, res, requestId) {
  const model = options.model || MODEL
  const completionId = `chatcmpl-${Date.now()}`
  const startTime = Date.now()

  console.log(`[${ts()}] ${requestId} | Spawning Claude Code (${model})...`)

  try {
    const result = await runClaude(prompt, options)
    const elapsed = Date.now() - startTime
    console.log(`[${ts()}] ${requestId} | Claude responded (${elapsed}ms, ${result.text.length} chars)`)
    console.log(`[${ts()}] ${requestId} | Streaming to client...`)

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })

    // Chunk into words for realistic streaming feel
    const words = result.text.split(/(\s+)/)
    let chunkCount = 0

    for (const word of words) {
      if (res.destroyed) {
        console.log(`[${ts()}] ${requestId} | Client disconnected mid-stream`)
        return
      }
      if (word) {
        sendSSE(res, completionId, model, word)
        chunkCount++
      }
    }

    // Finish
    const finalChunk = {
      id: completionId,
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model: `claude-code-${model}`,
      choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
    }
    res.write(`data: ${JSON.stringify(finalChunk)}\n\n`)
    res.write('data: [DONE]\n\n')
    res.end()

    console.log(`[${ts()}] ${requestId} | Done (${chunkCount} chunks streamed)`)
  } catch (err) {
    console.error(`[${ts()}] ${requestId} | ERROR: ${err.message}`)

    if (!res.headersSent) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      })
    }

    sendSSE(res, completionId, model, `Error: ${err.message}`)
    res.write('data: [DONE]\n\n')
    res.end()
  }
}

function sendSSE(res, id, model, content) {
  const chunk = {
    id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model: `claude-code-${model}`,
    choices: [{
      index: 0,
      delta: { content },
      finish_reason: null,
    }],
  }
  res.write(`data: ${JSON.stringify(chunk)}\n\n`)
}

// --- Extract prompt + system from messages/input ---
function parseMessages(body) {
  // Support both OpenAI chat format and Responses API format
  const messages = body.messages || body.input || []
  let systemPrompt = body.instructions || ''
  const parts = []

  for (const msg of messages) {
    const content = typeof msg === 'string' ? msg : msg.content
    const role = typeof msg === 'string' ? 'user' : msg.role

    if (role === 'system') {
      systemPrompt += (systemPrompt ? '\n' : '') + content
    } else if (role === 'user') {
      parts.push(content)
    } else if (role === 'assistant') {
      parts.push(`[Previous assistant response: ${content}]`)
    }
  }

  return { prompt: parts.join('\n\n'), systemPrompt }
}

// --- HTTP Server ---
const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)

  // --- Health ---
  if (url.pathname === '/health') {
    json(res, { status: 'ok', model: MODEL, claude: CLAUDE_BIN })
    return
  }

  // --- List Models ---
  if (url.pathname === '/v1/models' && req.method === 'GET') {
    json(res, {
      object: 'list',
      data: [
        { id: 'claude-code-opus', object: 'model', owned_by: 'anthropic' },
        { id: 'claude-code-sonnet', object: 'model', owned_by: 'anthropic' },
        { id: 'claude-code-haiku', object: 'model', owned_by: 'anthropic' },
      ],
    })
    return
  }

  // --- Ollama-style generate ---
  if (url.pathname === '/api/generate' && req.method === 'POST') {
    const requestId = `req-${Date.now().toString(36)}`
    try {
      const body = await readBody(req)
      const { prompt, model, system } = body

      if (!prompt) {
        json(res, { error: 'missing "prompt" field' }, 400)
        return
      }

      console.log(`\n[${ts()}] ${requestId} | /api/generate`)
      console.log(`[${ts()}] ${requestId} | Model: ${model || MODEL}`)
      console.log(`[${ts()}] ${requestId} | Question: "${trunc(prompt, 120)}"`)

      const startTime = Date.now()
      const result = await runClaude(prompt, { model, systemPrompt: system })
      const elapsed = Date.now() - startTime

      console.log(`[${ts()}] ${requestId} | Done (${elapsed}ms, ${result.text.length} chars)`)

      json(res, {
        model: result.model,
        response: result.text,
        done: true,
      })
    } catch (err) {
      console.error(`[${ts()}] ${requestId} | ERROR: ${err.message}`)
      json(res, { error: err.message }, 500)
    }
    return
  }

  // --- OpenAI chat completions + responses API ---
  const isChatRoute = url.pathname === '/v1/chat/completions' && req.method === 'POST'
  const isResponsesRoute = url.pathname === '/v1/responses' && req.method === 'POST'

  if (isChatRoute || isResponsesRoute) {
    const requestId = `req-${Date.now().toString(36)}`
    const routeName = isChatRoute ? '/v1/chat/completions' : '/v1/responses'

    try {
      const body = await readBody(req)
      const stream = body.stream ?? false
      const model = body.model || MODEL
      const cleanModel = model.replace('claude-code-', '')

      const { prompt, systemPrompt } = parseMessages(body)

      if (!prompt) {
        json(res, { error: 'no user message found' }, 400)
        return
      }

      console.log(`\n[${ts()}] ${requestId} | ${routeName}`)
      console.log(`[${ts()}] ${requestId} | Model: ${cleanModel} | Stream: ${stream}`)
      console.log(`[${ts()}] ${requestId} | Question: "${trunc(prompt, 120)}"`)
      if (systemPrompt) {
        console.log(`[${ts()}] ${requestId} | System prompt: ${systemPrompt.length} chars`)
      }

      if (stream) {
        streamClaude(prompt, { model: cleanModel, systemPrompt }, res, requestId)
        return
      }

      // Non-streaming
      console.log(`[${ts()}] ${requestId} | Processing...`)
      const startTime = Date.now()
      const result = await runClaude(prompt, { model: cleanModel, systemPrompt })
      const elapsed = Date.now() - startTime
      console.log(`[${ts()}] ${requestId} | Done (${elapsed}ms, ${result.text.length} chars)`)

      json(res, {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: result.model,
        choices: [{
          index: 0,
          message: { role: 'assistant', content: result.text },
          finish_reason: 'stop',
        }],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      })
    } catch (err) {
      console.error(`[${ts()}] ${requestId} | ERROR: ${err.message}`)
      json(res, { error: err.message }, 500)
    }
    return
  }

  // --- 404 ---
  console.log(`[${ts()}] 404: ${req.method} ${url.pathname}`)
  json(res, {
    error: 'not found',
    endpoints: [
      'POST /api/generate',
      'POST /v1/chat/completions',
      'POST /v1/responses',
      'GET  /v1/models',
      'GET  /health',
    ],
  }, 404)
})

function printBanner() {
  console.log(`
╔══════════════════════════════════════════════════╗
║  Claude Code API Server                          ║
║  http://localhost:${PORT}                           ║
║  Model: ${MODEL.padEnd(40)}║
╠══════════════════════════════════════════════════╣
║  POST /v1/chat/completions   (OpenAI + SSE)      ║
║  POST /v1/responses          (Responses API)     ║
║  POST /api/generate          (Ollama)            ║
║  GET  /v1/models                                 ║
║  GET  /health                                    ║
╚══════════════════════════════════════════════════╝
`)
}

// Auto-kill old process on same port
server.on('error', async (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} in use — killing old process...`)
    const { execSync } = await import('node:child_process')
    try {
      execSync(`lsof -ti:${PORT} | xargs kill -9`, { stdio: 'ignore' })
    } catch { /* nothing to kill */ }
    setTimeout(() => server.listen(PORT, printBanner), 500)
  } else {
    throw err
  }
})

server.listen(PORT, printBanner)

// --- Helpers ---
function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data, null, 2))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => { data += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(data)) }
      catch { reject(new Error('Invalid JSON body')) }
    })
    req.on('error', reject)
  })
}

function ts() {
  return new Date().toISOString().slice(11, 19)
}

function trunc(s, n = 60) {
  return s.length > n ? s.slice(0, n) + '...' : s
}
