import type { SalesforceTicket } from './types'

/**
 * Placeholder for ASU Salesforce integration.
 *
 * In production, this would call the Salesforce REST API to create a Case:
 * POST https://asu.my.salesforce.com/services/data/v60.0/sobjects/Case
 *
 * Required env vars for real integration:
 * - SALESFORCE_INSTANCE_URL
 * - SALESFORCE_CLIENT_ID
 * - SALESFORCE_CLIENT_SECRET
 * - SALESFORCE_USERNAME
 * - SALESFORCE_PASSWORD
 */

let ticketCounter = 1000

function categorizeAdvice(text: string): SalesforceTicket['category'] {
  const lower = text.toLowerCase()
  if (lower.includes('financial') || lower.includes('fafsa') || lower.includes('scholarship') || lower.includes('tuition'))
    return 'financial-aid'
  if (lower.includes('career') || lower.includes('internship') || lower.includes('resume') || lower.includes('interview') || lower.includes('job'))
    return 'career-services'
  if (lower.includes('stress') || lower.includes('anxiety') || lower.includes('mental') || lower.includes('overwhelm') || lower.includes('counsel'))
    return 'counseling'
  if (lower.includes('class') || lower.includes('major') || lower.includes('schedule') || lower.includes('gpa') || lower.includes('professor') || lower.includes('advisor'))
    return 'academic-advising'
  return 'general'
}

function assessPriority(text: string): SalesforceTicket['priority'] {
  const lower = text.toLowerCase()
  if (lower.includes('deadline') || lower.includes('urgent') || lower.includes('failing') || lower.includes('drop') || lower.includes('crisis'))
    return 'high'
  if (lower.includes('help') || lower.includes('struggling') || lower.includes('confused') || lower.includes('worried'))
    return 'medium'
  return 'low'
}

export function isActionableAdvice(aiResponse: string): boolean {
  const lower = aiResponse.toLowerCase()
  const actionIndicators = [
    'i recommend',
    'you should',
    'next step',
    'i suggest',
    'consider',
    'make sure to',
    'visit the',
    'contact',
    'schedule',
    'sign up',
    'apply for',
    'reach out',
    'talk to',
    'go to',
    'check out',
    'deadline',
  ]
  const smallTalkIndicators = [
    'how are you',
    'nice to meet',
    'hello',
    'hi there',
    'good morning',
    'welcome',
    "that's great",
    'glad to hear',
  ]

  const hasAction = actionIndicators.some((ind) => lower.includes(ind))
  const isSmallTalk = smallTalkIndicators.some((ind) => lower.includes(ind))

  return hasAction && !isSmallTalk && aiResponse.length > 100
}

export function createSalesforceTicket(
  studentQuestion: string,
  aiResponse: string,
  studentName: string = 'Jordan Rivera'
): SalesforceTicket {
  ticketCounter++
  const category = categorizeAdvice(studentQuestion + ' ' + aiResponse)
  const priority = assessPriority(studentQuestion)

  const ticket: SalesforceTicket = {
    id: `sf-${ticketCounter}`,
    caseNumber: `ASU-${ticketCounter}`,
    subject: studentQuestion.length > 80 ? studentQuestion.slice(0, 80) + '...' : studentQuestion,
    description: `Student inquiry via FirstGen Connect AI:\n\nQuestion: ${studentQuestion}\n\nAI Guidance Provided: ${aiResponse.slice(0, 500)}${aiResponse.length > 500 ? '...' : ''}`,
    category,
    priority,
    status: 'new',
    studentName,
    createdAt: new Date().toISOString(),
    assignedTo: getAssignment(category),
  }

  // In production: POST to Salesforce API here
  console.log(`[Salesforce Placeholder] Created ticket ${ticket.caseNumber}:`, {
    category: ticket.category,
    priority: ticket.priority,
    subject: ticket.subject,
  })

  return ticket
}

function getAssignment(category: SalesforceTicket['category']): string {
  const assignments: Record<string, string> = {
    'academic-advising': 'ASU Academic Advising Team',
    'financial-aid': 'ASU Financial Aid Office',
    'career-services': 'ASU Career & Professional Development',
    'counseling': 'ASU Counseling Services',
    'general': 'ASU First-Gen Student Support',
  }
  return assignments[category]
}
