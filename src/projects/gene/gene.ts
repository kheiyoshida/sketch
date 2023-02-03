import p5 from "p5";
import { destVect, pushPop, randomBetween } from "../../lib/utils";

export function gene(
  v: p5.Vector,
  len: number,
  width: number,
  recursion: number = 6,
  angle: number = 0,
) {
  if (recursion === 0) {
    return 
  }
  if (recursion < 7) {
    len = len * recursion / 3
  }

  pushPop(() => {
    const [right, left] = [ angle + width/2, angle - angle/2 ]
    let dest1 = destVect(v, right, randomBetween(len-20, len+20))
    let dest2 = destVect(v, left, randomBetween(len-20, len+20))

    p.line(v.x, v.y, dest1.x, dest1.y)
    p.line(v.x, v.y, dest2.x, dest2.y)

    gene(dest1, len, width, recursion - 1, angle + width/2, )
    gene(dest2, len, width, recursion - 1, angle - width/2, )
  })
}


export class Gene {
  constructor(
    private v: p5.Vector,
    private len: number,
    private width: number,
    private recursion: number = 7,
    private angle: number = 0,
  ){
    this.len = ((100 - recursion) / 100) * 50
  }

  grow(rootAngle: number = 0) {

    // if (this.recursion === 0) {
    //   return []
    // }

    const [right, left] = [
      this.angle + this.width/2, 
      this.angle - this.width/2 
    ]

    const dest1 = destVect(this.v, right, randomBetween(this.len - 10, this.len + 20))
    const dest2 = destVect(this.v, left, randomBetween(this.len - 10, this.len + 20))
    
    const weightedAngle = (
      () => {
        const thr = 30
        let base = rootAngle + this.angle
        base = base - Math.floor(base / 360) * 360
        if (base > thr && base < thr*2) {
          base = base - thr
        } 
        else if (base < thr*2+270 && base > 270 + thr) {
          base = base + thr
        }
        return base
      }
    )()
    const result = [
      new Gene(dest1, this.len, this.width, this.recursion+1, weightedAngle+this.width/2),
      new Gene(dest2, this.len, this.width, this.recursion+1, weightedAngle-this.width/2),
    ]

    const l1 = () => p.line(this.v.x, this.v.y, dest1.x, dest1.y)
    const l2 = () => p.line(this.v.x, this.v.y, dest2.x, dest2.y)
    

    if (this.recursion > 55) {
      return []
    }

    const fatalRate = 1 / this.recursion

    if (fatalRate > 1) {
      return result
    } else {
      const fate = Math.floor(randomBetween(1, this.recursion))

      if (fate >= 0 && fate <15) {
        l1()
        return result[0]
      } else if (fate >= 15 && fate <30) {
        l2()
        return result[1]
      } else if (fate >=30 && fate < 50) {
        l1()
        l2()
        return result
      } else {
        return []
      }
    }
  }
}