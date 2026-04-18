import { createContext, useEffect, useMemo, type ReactNode } from 'react';
import { getTheme, applyThemeToDocument, type ThemeTemplate, type ThemeTokens } from '../themes';

export interface ThemeContextValue {
  template: ThemeTemplate;
  t: ThemeTokens;
}

export const ThemeContext = createContext<ThemeContextValue>({
  template: 'zen',
  t: getTheme('zen'),
});

interface Props {
  template: ThemeTemplate | undefined | null;
  children: ReactNode;
}

export function ThemeProvider({ template, children }: Props) {
  const resolved: ThemeTemplate = template === 'warm' ? 'warm' : 'zen';

  useEffect(() => {
    applyThemeToDocument(resolved);
  }, [resolved]);

  const value = useMemo<ThemeContextValue>(
    () => ({ template: resolved, t: getTheme(resolved) }),
    [resolved],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
