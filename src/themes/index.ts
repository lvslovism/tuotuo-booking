import { zen } from './zen';
import { warm } from './warm';
import type { ThemeTemplate, ThemeTokens } from './types';

export type { ThemeTemplate, ThemeTokens };

const themes: Record<ThemeTemplate, ThemeTokens> = { zen, warm };

export function getTheme(template: ThemeTemplate | undefined | null): ThemeTokens {
  if (template === 'warm') return warm;
  return zen;
}

export function applyThemeToDocument(template: ThemeTemplate) {
  const t = themes[template] ?? zen;
  const root = document.documentElement;

  root.setAttribute('data-theme', t.name);

  const v = (k: string, val: string) => root.style.setProperty(k, val);

  v('--t-bg', t.bg);
  v('--t-bg-soft', t.bgSoft);
  v('--t-card', t.card);
  v('--t-primary', t.primary);
  v('--t-primary-soft', t.primarySoft);
  v('--t-accent', t.accent);
  v('--t-gold', t.gold);
  v('--t-text', t.text);
  v('--t-sub', t.sub);
  v('--t-muted', t.muted);
  v('--t-line', t.line);
  v('--t-success', t.success);
  v('--t-cta', t.cta);
  v('--t-cta-text', t.ctaText);
  v('--t-cta-shadow', t.ctaShadow);

  v('--t-font-title', t.fontTitle);
  v('--t-font-body', t.fontBody);
  v('--t-fw-title', String(t.fontWeightTitle));
  v('--t-fw-body', String(t.fontWeightBody));

  v('--t-card-border', t.cardBorder);
  v('--t-card-shadow', t.cardShadow);
  v('--t-card-radius', `${t.cardRadius}px`);
  v('--t-btn-radius', `${t.btnRadius}px`);
  v('--t-btn-letter-spacing', t.btnLetterSpacing);

  v('--t-anim-duration', t.animDuration);
  v('--t-anim-easing', t.animEasing);

  v('--t-header-bg', t.headerBg);

  // Back-compat for legacy classes: keep the original --brand-* / --color-* vars aligned
  v('--brand-primary', t.primary);
  v('--brand-accent', t.accent);
  v('--brand-success', t.success);
  v('--brand-bg', t.bg);
  v('--brand-text-secondary', t.sub);
}
