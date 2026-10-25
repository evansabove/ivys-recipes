// Helpers for multiplying recipe quantities up or down.
// Only the leading quantity of a phrase is scaled ("150g plain flour", "2-3 apples", "½ tsp cumin"),
// so pack sizes in brackets like "1 tin (400g)" are left alone.

const FRACTIONS: Record<string, number> = { '⅛': 1 / 8, '¼': 1 / 4, '⅓': 1 / 3, '½': 1 / 2, '⅔': 2 / 3, '¾': 3 / 4 }
const FRACTION_CHARS = Object.keys(FRACTIONS).join('')

const NUMBER = `(?:\\d+(?:\\.\\d+)?[${FRACTION_CHARS}]?|[${FRACTION_CHARS}])`
// Quantity (or range) with an optional metric unit stuck to it
const QUANTITY = new RegExp(`^(${NUMBER})(?:\\s?([-–])\\s?(${NUMBER}))?(\\s?(?:kg|g|ml|l)\\b)?`, 'i')

function parseNumber(text: string): number {
  const last = text.slice(-1)
  if (FRACTIONS[last] !== undefined) {
    const whole = text.slice(0, -1)
    return (whole ? parseFloat(whole) : 0) + FRACTIONS[last]
  }
  return parseFloat(text)
}

// Parse a scale option from frontmatter: 2, 0.5 or "1/4"
export function parseScale(option: number | string): number {
  if (typeof option === 'number') return option
  const [num, den] = option.split('/').map(Number)
  return num / den
}

// Render a number as a cook would write it: "¼", "1½", "37"
export function formatQuantity(value: number, metric = false): string {
  if (metric) {
    return value >= 10 ? String(Math.round(value)) : String(Math.round(value * 10) / 10)
  }
  if (value >= 10) return String(Math.round(value))

  let whole = Math.floor(value)
  let best = { char: '', value: 0 }
  for (const [char, frac] of Object.entries(FRACTIONS)) {
    if (Math.abs(value - whole - frac) < Math.abs(value - whole - best.value)) best = { char, value: frac }
  }
  // Rounding up to the next whole number is closer than any fraction
  if (1 - (value - whole) < Math.abs(value - whole - best.value)) {
    whole += 1
    best = { char: '', value: 0 }
  }
  if (whole === 0 && !best.char) return FRACTION_CHARS[0] // never round down to nothing
  return `${whole || ''}${best.char}`
}

// Scale the leading quantity of a phrase, e.g. "150g plain flour" × ¼ → "38g plain flour"
function scaleLeading(text: string, scale: number): string {
  return text.replace(QUANTITY, (match, from: string, dash: string | undefined, to: string | undefined, unit: string | undefined) => {
    const isMetric = !!unit
    const low = formatQuantity(parseNumber(from) * scale, isMetric)
    let result = low
    if (to) {
      const high = formatQuantity(parseNumber(to) * scale, isMetric)
      if (high !== low) result += `${dash}${high}`
    }
    return result + (unit ?? '')
  })
}

// Scale an ingredient line. Also handles alternatives: "3 medium or 2 large apples"
export function scaleIngredient(item: string, scale: number): string {
  if (scale === 1) return item
  return item
    .split(/(\bor\s+)/)
    .map(part => scaleLeading(part, scale))
    .join('')
}

// Scale the **bold** quantities in a method step
export function scaleStep(step: string, scale: number): string {
  if (scale === 1) return step
  return step.replace(/\*\*(.+?)\*\*/g, (_, inner) => `**${scaleIngredient(inner, scale)}**`)
}

// Label for a scale option: "¼×", "1×", "2×"
export function formatScale(scale: number): string {
  return `${formatQuantity(scale)}×`
}
