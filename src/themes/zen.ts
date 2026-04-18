import type { ThemeTokens } from './types';

export const zen: ThemeTokens = {
  name: 'zen',

  bg: '#F6F4F0',
  bgSoft: '#EFECE7',
  card: '#FDFCFA',
  primary: '#3B6B5E',
  primarySoft: '#3B6B5E18',
  accent: '#C4A265',
  gold: '#C4A265',
  text: '#2C2C2C',
  sub: '#7A7770',
  muted: '#B0ADA6',
  line: '#E5E2DC',
  success: '#3B6B5E',
  cta: '#3B6B5E',
  ctaText: '#FFFFFF',
  ctaShadow: '0 4px 16px rgba(59,107,94,0.20)',

  fontTitle: '"Noto Serif TC", Georgia, serif',
  fontBody: '"Noto Sans TC", -apple-system, sans-serif',
  fontWeightTitle: 400,
  fontWeightBody: 300,

  cardBorder: '1px solid #E5E2DC',
  cardShadow: 'none',
  cardRadius: 16,
  btnRadius: 12,
  btnLetterSpacing: '2px',

  accentLine: true,
  goldDivider: true,

  animation: 'breatheIn',
  animDuration: '0.5s',
  animEasing: 'cubic-bezier(0.22,1,0.36,1)',

  slotStyle: 'list',
  headerBg: 'transparent',
  headerStyle: 'minimal',
  labelStyle: 'uppercase',
};
