import p5 from "p5";
import { destVect, vline } from "../../lib/utils";
import { randomBetween } from "../sk_01/utils";

export class Wing {

  private vertices: p5.Vector[] = []

  constructor(
    private v: p5.Vector,
    private angle = 315,
    private len = 100,
    private re = 10
  ) {
    this.vertices = [v]
  }

  public grow() {

    // die
    if (this.vertices.length >= 10000) return true

    if (this.len >= 200) return true

    if (this.re >= 400) return true

    if (this.vertices.length > 20) {
      // this.vertices = this.vertices.slice(0, 20)
      return true
    }

    this.re += 1
    let res:p5.Vector[] = []

    for (const v of this.vertices) {
      const result = this.wing(v)
      res = res.concat(result)
    }
    this.angle += 120 + randomBetween(-20, 20)
    this.len += randomBetween(-8, 22)
    
    this.vertices = res
  }

  private wing(
    origin: p5.Vector
  ) {
    const a = randomBetween(this.angle+30, this.angle-10) 

    const d1 = destVect(origin, a, this.len)
    simmer(origin, d1)

    const a2 = randomBetween(a+30, a) 
    const d2 = destVect(d1, a2, this.len+20)
    simmer(d1, d2)

    const a3 = randomBetween(a-30, a) 
    const d3 = destVect(d2, a3, this.len-20)
    simmer(d2, d3)

    if (!validate(d2) || !validate(d3)) {
      return [d1]
    }

    return Math.floor(randomBetween(0, 12)) == 0
      ? [d2, d3]
      : [d2]
  }
}



const validate = (v: p5.Vector) => {
  if (
    v.x<p.windowWidth*1.5
    && v.x > -p.windowWidth/2
    && v.y < p.windowHeight*1.5
    && v.y > -p.windowHeight/2
  ) {
    return true
  } else return false
}

const DOTS = 150



export function simmer(v1: p5.Vector, v2: p5.Vector) {

  for (let i = 1; i<=DOTS; i+=1) {
    
    p.point(
      weighted(v1.x, v2.x, i, DOTS),
      weighted(v1.y, v2.y, i, DOTS),
    )
  }
}

const weighted = (
  a:number,b:number,
  w: number, 
  all: number,
) => {
  return ((all - w)/all * a + w/all * b)
}
