
export const randomBetween = (min: number, max: number) => {
  const ratio = Math.random()
  return (max - min) * ratio + min
}