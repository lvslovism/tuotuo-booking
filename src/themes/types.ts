export type ThemeTemplate = 'zen' | 'warm';

export interface ThemeTokens {
  name: ThemeTemplate;

  // Colors
  bg: string;
  bgSoft: string;
  card: string;
  primary: string;
  primarySoft: string;
  accent: string;
  gold: string;
  accentWarm?: string;
  warmNeutral?: string;
  warmBg?: string;
  text: string;
  sub: string;
  muted: string;
  line: string;
  success: string;
  cta: string;
  ctaText: string;
  ctaShadow: string;

  // Typography
  fontTitle: string;
  fontBody: string;
  fontWeightTitle: number;
  fontWeightBody: number;

  // Shape
  cardBorder: string;
  cardShadow: string;
  cardRadius: number;
  btnRadius: number;
  btnLetterSpacing: string;

  // Decoration flags
  accentLine: boolean;
  goldDivider: boolean;

  // Motion
  animation: 'breatheIn' | 'popIn';
  animDuration: string;
  animEasing: string;

  // Layout variants
  slotStyle: 'list' | 'grid';
  headerBg: string;
  headerStyle: 'minimal' | 'branded';
  labelStyle: 'uppercase' | 'normal';
}
