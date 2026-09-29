// TTDYATRA Design Tokens — JS export for runtime use
// Mirrors tokens.css — single source of truth

export const colors = {
  maroon: {
    900: '#4A0E1C',
    800: '#611626',
    700: '#7A1E2D',
    600: '#8C2A3B',
    500: '#9A3648',
    100: '#F3DEE2',
    50:  '#FAF0F2',
  },
  gold: {
    700: '#A88318',
    600: '#C9A227',
    400: '#E3C05C',
    200: '#F2DEA2',
    100: '#F9EFD3',
    tint: '#FDF6E3',
  },
  saffron: {
    600: '#C96412',
    500: '#E87A1D',
    100: '#FCE8D8',
  },
  ivory:   '#FBF7EF',
  cream:   '#F8F2E4',
  paper:   '#FEFCF7',
  sand:    '#EDE4D3',
  sandal:  { 200: '#F3E7D3', 100: '#FAF3E6' },
  ink:     '#2B2320',
  muted:   '#6B615C',
  line:    '#E0D4C0',
  neutral: {
    900: '#2B2320',
    700: '#4A3F3A',
    600: '#6B615C',
    400: '#9C8F88',
    300: '#D8CBB8',
    200: '#EDE6D9',
  },
  white:   '#FFFFFF',
  success: '#2E7D46',
  warning: '#B97A00',
  error:   '#B3261E',
  info:    '#1E5AA8',
};

export const gradients = {
  gold:         'linear-gradient(180deg, #F2DEA2 0%, #E3C05C 50%, #C9A227 100%)',
  sanctum:      'linear-gradient(160deg, #611626 0%, #4A0E1C 100%)',
  heroOverlay:  'linear-gradient(180deg, rgba(74,14,28,0.55) 0%, rgba(0,0,0,0.40) 100%)',
};

export const fonts = {
  display: "'Cinzel', Georgia, serif",
  heading:  "'Marcellus', Georgia, serif",
  body:     "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  regional: "'Mukta', 'Noto Sans Telugu', sans-serif",
};

export const shadows = {
  xs:        '0 1px 2px rgba(43,35,32,0.05)',
  sm:        '0 1px 4px rgba(43,35,32,0.06), 0 2px 8px rgba(43,35,32,0.04)',
  md:        '0 2px 8px rgba(43,35,32,0.08), 0 4px 16px rgba(43,35,32,0.06)',
  lg:        '0 4px 16px rgba(43,35,32,0.10), 0 8px 32px rgba(43,35,32,0.08)',
  xl:        '0 8px 32px rgba(43,35,32,0.12), 0 16px 48px rgba(43,35,32,0.10)',
  gold:      '0 4px 16px rgba(201,162,39,0.25)',
};

export const transitions = {
  fast:   '150ms ease',
  base:   '250ms ease',
  slow:   '400ms ease',
  spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const breakpoints = {
  mobile:  '767px',
  tablet:  '1199px',
  desktop: '1439px',
  wide:    '1440px',
};

export const zIndex = {
  base:    1,
  card:    10,
  nav:     100,
  sticky:  200,
  modal:   300,
  toast:   400,
  tooltip: 500,
};

export default { colors, gradients, fonts, shadows, transitions, breakpoints, zIndex };
