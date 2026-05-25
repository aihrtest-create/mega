// Design tokens for V3 — based on Hello Park "Праздничные предложения" PDF (03.2026)
// All values are tuned for mobile.

export const v3 = {
  // Brand
  orange:        "#FF6022", // primary CTA (already in app theme)
  orangeBright:  "#FF8A1C", // softer accent
  yellowSun:     "#FFB81C", // "Базовый" pill / yellow accents
  pinkHit:       "#FF5C8A", // "Премиум · ХИТ ПРОДАЖ" pill
  purpleDeep:    "#5B2EBE", // headings / "Эксклюзив"
  purpleSoft:    "#A48BF5", // soft gradient
  lavender:      "#E9DEFF", // soft cards
  lavenderDeep:  "#C9B6FF", // accent fills
  cream:         "#FFF7E5", // page warm tint
  greenTag:      "#7DEAA0", // "Хит!" / "Топ!" tag
  greenTagText:  "#0E5C2D",

  // Surface
  bg:            "#FFFFFF",
  bgWarm:        "#FFF5E0", // warm hero bg like PDF cover
  bgPurple:      "#3F1E94", // dark purple "park razvlecheniy" bg
  ink:           "#1A1A1A",
  inkSoft:       "#5C5170",
  inkMuted:      "#8E889E",

  // Pills + ratings
  shadow:        "0 8px 24px rgba(91, 46, 190, 0.10)",
  shadowSoft:    "0 4px 16px rgba(0,0,0,0.06)",
  shadowCta:     "0 12px 28px rgba(255, 96, 34, 0.32)",
} as const;

export const PACKAGE_TINTS = {
  basic:     { fill: "#FFE9A8", ink: "#7A4A00", chip: v3.yellowSun },
  premium:   { fill: "#FFD3DF", ink: "#7A0F2A", chip: v3.pinkHit },
  exclusive: { fill: "#E1D2FF", ink: "#3D1F8C", chip: v3.purpleDeep },
  individual:{ fill: "#F1ECFF", ink: v3.purpleDeep, chip: v3.purpleSoft },
} as const;
