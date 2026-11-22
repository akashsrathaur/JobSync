/**
 * PII redaction and sanitization utilities
 * Enforces privacy compliance (DPDP Act 2023 India) and protects logs.
 */

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
// Indian 10-digit mobile numbers with optional +91 or 0 prefix
const INDIAN_PHONE_REGEX = /(?:\+91[\-\s]?)?[6-9]\d{9}/g;
// International phone numbers format
const INTL_PHONE_REGEX = /\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
// Indian Aadhaar-like 12 digit numbers
const AADHAAR_REGEX = /\b\d{4}\s\d{4}\s\d{4}\b/g;

/**
 * Masks sensitive PII in strings before writing to application loggers or analytics
 */
export function redactPiiFromLogs(text: string): string {
  if (!text) return '';

  return text
    .replace(EMAIL_REGEX, (match) => {
      const parts = match.split('@');
      if (parts[0].length <= 2) return `**@${parts[1]}`;
      return `${parts[0].slice(0, 2)}***@${parts[1]}`;
    })
    .replace(INDIAN_PHONE_REGEX, '+91-XXXXX-XXXX')
    .replace(INTL_PHONE_REGEX, '[PHONE-REDACTED]')
    .replace(AADHAAR_REGEX, 'XXXX-XXXX-XXXX');
}

/**
 * Inspects parsed text to identify contact fields for the resume header
 * without leaking them in unauthorized endpoints.
 */
export function extractBasicContactHints(text: string): {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
} {
  const emailMatch = text.match(EMAIL_REGEX);
  const phoneMatch = text.match(INDIAN_PHONE_REGEX) || text.match(INTL_PHONE_REGEX);
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);

  return {
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    github: githubMatch ? githubMatch[0] : undefined,
  };
}
