

export function stringToArray(text: string): Array<number> {
    const array = Array.isArray(text) ? text : text.split('-')
    return array
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number)
      .filter((n) => !isNaN(n) && Number.isInteger(n))
  }
  