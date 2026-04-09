import { readFileSync } from 'fs';
import { join } from 'path';
import type { KnowledgeChunk, SearchResult } from './types';

const STOPWORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
  'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
  'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no',
  'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
  'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
  'give', 'day', 'most', 'are', 'was', 'is', 'has', 'been', 'were',
  'being', 'had', 'did', 'does', 'doing', 'should', 'may', 'might',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

// BM25 parameters
const K1 = 1.5;
const B = 0.75;

class KnowledgeStore {
  private chunks: KnowledgeChunk[];
  private tokenizedDocs: string[][];
  private avgDl: number;

  constructor(chunks: KnowledgeChunk[]) {
    this.chunks = chunks;
    this.tokenizedDocs = chunks.map(c =>
      tokenize(c.title + ' ' + c.title + ' ' + c.text)
    );
    const totalLen = this.tokenizedDocs.reduce((s, d) => s + d.length, 0);
    this.avgDl = this.tokenizedDocs.length > 0
      ? totalLen / this.tokenizedDocs.length
      : 1;
  }

  private idf(term: string): number {
    const n = this.tokenizedDocs.length;
    const df = this.tokenizedDocs.filter(d => d.includes(term)).length;
    return Math.log((n - df + 0.5) / (df + 0.5) + 1);
  }

  private score(queryTokens: string[], docIndex: number): number {
    const doc = this.tokenizedDocs[docIndex];
    const dl = doc.length;
    let score = 0;

    for (const term of queryTokens) {
      const tf = doc.filter(t => t === term).length;
      const idfVal = this.idf(term);
      score += idfVal * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + B * dl / this.avgDl)));
    }

    return score;
  }

  search(query: string, topK = 5): SearchResult[] {
    if (this.chunks.length === 0) return [];

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const results: SearchResult[] = this.chunks.map((chunk, i) => ({
      chunk,
      score: this.score(queryTokens, i),
    }));

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter(r => r.score > 0);
  }
}

let _store: KnowledgeStore | null = null;

function getStore(): KnowledgeStore {
  if (!_store) {
    try {
      const dataPath = join(process.cwd(), 'src/lib/rag/data/knowledge-base.json');
      const raw = readFileSync(dataPath, 'utf-8');
      const data = JSON.parse(raw);
      _store = new KnowledgeStore(data.chunks || []);
    } catch {
      _store = new KnowledgeStore([]);
    }
  }
  return _store;
}

export function searchKnowledge(query: string, topK = 5): SearchResult[] {
  return getStore().search(query, topK);
}

export function formatContext(results: SearchResult[]): string {
  if (results.length === 0) return '';

  const contextParts = results.map((r, i) =>
    `[Source ${i + 1}: ${r.chunk.title} — ${r.chunk.sourceUrl}]\n${r.chunk.text}`
  );

  return `\n\nRELEVANT ASU KNOWLEDGE BASE CONTEXT:\n${contextParts.join('\n\n---\n\n')}`;
}

export function getSourceCitations(results: SearchResult[]): string[] {
  return [...new Set(results.map(r => r.chunk.sourceUrl))];
}
