/**
 * Slurs and Profanity filter utility
 * Provides masking, detection, and blur options for student-safe messaging
 */

const SLUR_PATTERNS: RegExp[] = [
  /\b(n+[i1!]+g+[e3a4@]+r*|n+[i1!]+g+a+)\b/gi,
  /\b(f+[a@4]+g+[o0]+t*|f+[a@4]+g+s*)\b/gi,
  /\b(k+[i1!]+k+[e3]+)\b/gi,
  /\b(c+[h]+[i1!]+n+k+)\b/gi,
  /\b(s+[p]+[i1!]+c+)\b/gi,
  /\b(w+[e3]+t+b+[a@4]+c+k+)\b/gi,
  /\b(r+[e3]+t+[a@4]+r+d+)\b/gi,
  /\b(f+[u*x]+c+k+)\b/gi,
  /\b(s+h+[i1!]+t+)\b/gi,
  /\b(b+[i1!]+t+c+h+)\b/gi,
  /\b(a+s+s+h+o+l+e+)\b/gi,
  /\b(d+[i1!]+c+k+)\b/gi,
  /\b(p+u+s+s+y+)\b/gi,
  /\b(c+u+n+t+)\b/gi,
  /\b(w+h+o+r+e+)\b/gi,
  /\b(s+l+u+t+)\b/gi,
];

export function hasProfanityOrSlur(text: string): boolean {
  if (!text) return false;
  return SLUR_PATTERNS.some((pattern) => pattern.test(text));
}

export function maskProfanity(text: string): string {
  if (!text) return '';
  let result = text;
  for (const pattern of SLUR_PATTERNS) {
    result = result.replace(pattern, (match) => {
      if (match.length <= 2) return '**';
      return match[0] + '*'.repeat(match.length - 2) + match[match.length - 1];
    });
  }
  return result;
}
