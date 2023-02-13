
export type Direction = 'n'|'e'|'s'|'w'

export const NESW = ['n', 'e', 's', 'w'] as const

export const compass = (d: 'r'|'l'|'o', currentDirection: Direction) => {
  let i = NESW.indexOf(currentDirection)
  switch (d) {
    case 'r':
      return NESW[(i+1)%4]
    case 'l':
      return NESW[(i+3)%4]
    case 'o':
      return NESW[(i+2)%4]
  }
}
