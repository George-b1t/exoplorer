
export function parseMass(value: number | string | null | undefined): { mass: number | null } {
  if (value == null) return { mass: null }
  if (typeof value === "number") {
    return Number.isFinite(value) ? { mass: value } : { mass: null }
  }
  // string: pode vir como "< 3.5", "≤1.2", "1.8", etc.
  const trimmed = value.trim().replace(",", ".")
  const m = trimmed.match(/^([<≤]\s*)?(\d+(\.\d+)?)/)
  if (!m) return { mass: null }
  const num = Number.parseFloat(m[2])
  return {
    mass: Number.isFinite(num) ? num : null,
  }
}