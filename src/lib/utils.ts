import p5 from "p5"

export function gridPoint(
  unit: number = 100
) {
  for (let i =0; i <= p.width; i += unit) {
    for (let l =0; l <= p.height; l += unit) {
      p.point(i, l)
    }
  }
}

export function translateByRadius(
  degree: number,
  radius: number
) {
  const v = p5.Vector.fromAngle(p.radians(degree), radius)
  p.translate(v)
}

export const randomBetween = (min: number, max: number) => {
  const ratio = Math.random()
  return (max - min) * ratio + min
}

export function randomColor() {
  const [c1, c2, c3] = Array(3).fill(0).map( (_) => randomBetween(0, 255))
  return p.color(c1, c2, c3)
}

export function pushPop(cb: Function) {
  p.push()
  cb()
  p.pop()
} 

export function destVect(
  v:p5.Vector,
  angle: number,
  len: number
) {
  return v.copy().add(p5.Vector.fromAngle(p.radians(angle), len))
}

export function vline(v1:p5.Vector, v2:p5.Vector) {
  p.line(v1.x, v1.y, v2.x, v2.y)
}

export function random(rate: number) {
  if (rate > 1 || rate < 0) {
    throw Error('rate should be between 0.0 and 1.0')
  }
  return Math.random() <= rate
}
