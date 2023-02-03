
export const SCALE = 1
export const s = (size: number) => SCALE * size

export const V = {
  w: s(800),
  h: s(800),
  c: s(400),
} as const

export const C = {
  white: 255,
  gray: 50,
  black: 0,
} as const

