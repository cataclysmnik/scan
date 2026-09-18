export const typography = {
  // Using system fonts but aiming for a bold, uppercase, structural feel
  h1: {
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
  },
  h2: {
    fontSize: 24,
    fontWeight: '800',
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  button: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
  },
};
