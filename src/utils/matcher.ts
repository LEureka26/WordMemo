export function normalizeString(str: string): string {
  return str
    .trim()
    .replace(/[\s\p{P}]/gu, '')
    .toLowerCase()
}

export function matchAnswer(userInput: string, correctAnswers: string[], fuzzyMatch: boolean): boolean {
  const normalizedInput = fuzzyMatch ? normalizeString(userInput) : userInput.trim()
  
  for (const answer of correctAnswers) {
    const normalizedAnswer = fuzzyMatch ? normalizeString(answer) : answer.trim()
    if (normalizedInput === normalizedAnswer) {
      return true
    }
  }
  return false
}
