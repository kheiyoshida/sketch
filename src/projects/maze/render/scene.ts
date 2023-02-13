import { pushPop } from "../../../lib/utils"
import { pointLine } from "./draw"
import { assumeSecondFrame, Layer } from "./frame"

export const renderStair = (
  f: Layer, 
  b: Layer, 
  current: boolean, 
  scene: number
) => {
  
  // ceiling
  pointLine(f.front.tl, f.back.bl)
  pointLine(f.front.tr, f.back.br)
  pointLine(f.back.bl, f.back.br)
  
  // next floor from distance
  if (!current) {
    pointLine(f.front.bl, f.front.br)
    pointLine(b.front.bl, [b.front.bl[0], f.front.bl[1]])
    pointLine(b.front.br, [b.front.br[0], f.front.br[1]])
  }
  // next floor when going down
  else {
    const secondFront = assumeSecondFrame(b.front)
    pointLine(b.front.bl, secondFront.bl)
    pointLine(b.front.br, secondFront.br)
    pushPop(() => {
      p.stroke(200, 100)
      const secondBack = assumeSecondFrame(b.back)
      const adjust = p.windowHeight * 0.015 * scene * scene * (scene<5?1.8: 1)
      pointLine(
        [b.front.bl[0], secondBack.bl[1]+adjust],
        [b.front.br[0], secondBack.br[1]+adjust]
      )
    })
  }
}