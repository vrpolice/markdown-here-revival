export function collectLegacyOptionChanges(options, defaults, legacyOptions) {
  const booleanKeys = ["math-enabled", "gfm-line-breaks-enabled"]
  const keys = [...booleanKeys, "main-css", "math-value"]
  const changes = {}

  for (const key of keys) {
    if (legacyOptions[key] === undefined || options[key] !== defaults[key]) {
      continue
    }
    let value = legacyOptions[key]
    if (booleanKeys.includes(key) && typeof value === "string") {
      value = value === "true"
    }
    changes[key] = value
  }

  return Object.keys(changes).length > 0 ? changes : null
}
