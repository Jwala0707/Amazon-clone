// Country code (ISO 3166-1 alpha-2) → translation key
// English is the fallback for all unmapped countries
const countryLangMap = {
  // Hindi
  IN: "hi", // India

  // Spanish
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es",
  PE: "es", VE: "es", EC: "es", GT: "es", CU: "es",
  BO: "es", DO: "es", HN: "es", PY: "es", SV: "es",
  NI: "es", CR: "es", PA: "es", UY: "es",

  // French
  FR: "fr", BE: "fr", CH: "fr", CA: "fr", SN: "fr",
  CI: "fr", CM: "fr", MG: "fr", ML: "fr", BF: "fr",
  NE: "fr", GN: "fr", BJ: "fr", TG: "fr", CD: "fr",
  CG: "fr", GA: "fr", HT: "fr", LU: "fr", MC: "fr",

  // English (explicit — also the default fallback)
  US: "en", GB: "en", AU: "en", NZ: "en", IE: "en",
  ZA: "en", NG: "en", KE: "en", GH: "en", PK: "en",
  PH: "en", SG: "en", MY: "en",
};

/**
 * Returns the best language code for a given country.
 * Always falls back to "en" if no mapping found.
 */
export function getLangForCountry(countryCode) {
  if (!countryCode) return "en";
  return countryLangMap[countryCode.toUpperCase()] || "en";
}

/**
 * Converts ISO 3166-1 alpha-2 country code to flag emoji.
 * e.g. "IN" → "🇮🇳", "US" → "🇺🇸"
 */
export function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export default countryLangMap;
