import type { ThemeTokens } from './types';

export const warm: ThemeTokens = {
  name: 'warm',

  bg: '#FAF7F2',
  bgSoft: '#F3EDE4',
  card: '#FFFFFF',
  primary: '#3B6B5E',
  primarySoft: '#3B6B5E15',
  accent: '#E8922D',
  gold: '#E8922D',
  accentWarm: '#D4841F',
  warmNeutral: '#C9A87C',
  warmBg: '#F5EDE0',
  text: '#33302B',
  sub: '#7D756A',
  muted: '#B5AFA5',
  line: '#EAE4DA',
  success: '#4A9B6E',
  cta: 'linear-gradient(135deg, #E8922D, #D4841F)',
  ctaText: '#FFFFFF',
  ctaShadow: '0 6px 18px rgba(232,146,45,0.30)',

  fontTitle: '"Noto Sans TC", -apple-system, sans-serif',
  fontBody: '"Noto Sans TC", -apple-system, sans-serif',
  fontWeightTitle: 600,
  fontWeightBody: 400,

  cardBorder: 'none',
  cardShadow: '0 2px 16px rgba(60,50,30,0.06)',
  cardRadius: 20,
  btnRadius: 16,
  btnLetterSpacing: '1.5px',

  accentLine: false,
  goldDivider: false,

  animation: 'popIn',
  animDuration: '0.45s',
  animEasing: 'cubic-bezier(0.22,1,0.36,1)',

  slotStyle: 'grid',
  headerBg: '#3B6B5E',
  headerStyle: 'branded',
  labelStyle: 'normal',
};
