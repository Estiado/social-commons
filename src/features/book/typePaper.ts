/** One palette supplies both the HTML paper and the WebGL edge blend. */
export const TYPE_PAPER_STOPS = [
  { offset: 0, color: '#f8f4ec' },
  { offset: 0.32, color: '#f3ecde' },
  { offset: 0.53, color: '#e8dbc4' },
  { offset: 0.77, color: '#cdb594' },
  { offset: 1, color: '#aa8a65' },
] as const;

export const TYPE_PAPER_GRADIENT = `linear-gradient(to bottom, ${TYPE_PAPER_STOPS.map(
  ({ offset, color }) => `${color} ${offset * 100}%`,
).join(', ')})`;
