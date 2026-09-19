export const SENEGAL_REGIONS = [
  "Dakar",
  "Thiès",
  "Diourbel",
  "Fatick",
  "Kaolack",
  "Kaffrine",
  "Kédougou",
  "Kolda",
  "Louga",
  "Matam",
  "Saint-Louis",
  "Sédhiou",
  "Tambacounda",
  "Ziguinchor",
] as const;

export type SenegalRegion = (typeof SENEGAL_REGIONS)[number];
