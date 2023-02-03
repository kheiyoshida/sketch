import p5 from "p5"
import { pushPop } from "./utils"

/**
 * assumes angleMode to be DEGREE
 */
export function expand<T>(
  root: p5.Vector,
  directions: number,
  cb: (degree: number) => T,
  rootDegree?: number
) {
  if (rootDegree) {
    p.push()
    p.rotate(rootDegree)
  }
  const devided = 360 / directions
  const circle = Array(directions).fill(0).map((_, x) => x * devided)
  const result:T[] = []
  for (const degree of circle) {
    pushPop(() => {
      p.translate(root.x, root.y)
      p.rotate(degree)
      result.push(cb(degree))
    })
  }
  return result
}