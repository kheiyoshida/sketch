import { pushPop } from "../../../lib/utils"
import { front, pointLine, side } from "./draw"
import { assumeSecondFrame, extractLayer, Frame, heightDownFrame, Layer, widenFrame } from "./frame"

export const renderStair = (
  f: Layer, 
  b: Layer, 
  current: boolean, 
) => {

  const downRate = 0.12
  const lilCloser = widenFrame(b.front, -0.5)
  const hdFrontBack = heightDownFrame(lilCloser, downRate)
    
  // ceiling
  pointLine(f.front.tl, hdFrontBack.bl)
  pointLine(f.front.tr, hdFrontBack.br)

  pointLine(
    hdFrontBack.bl, hdFrontBack.br
  )

  // next floor from distance
  if (!current) {
    pointLine(f.front.bl, f.front.br)
    pointLine(hdFrontBack.bl, [hdFrontBack.bl[0], f.front.bl[1]])
    pointLine(hdFrontBack.br, [hdFrontBack.br[0], f.front.br[1]])
  }
  // next floor when going down
  else {
    const secondFront = assumeSecondFrame(hdFrontBack)
    pushPop(() => {
      pointLine(hdFrontBack.bl, secondFront.bl)
      pointLine(hdFrontBack.br, secondFront.br)
      pointLine(f.front.bl, secondFront.bl)
      pointLine(f.front.br, secondFront.br)
      pointLine(secondFront.bl, secondFront.br)
    })
  }
}

export const renderCorridorToNextFloor = (
  frames: Frame[]
) => {
  const { frontLayer: f1, backLayer: b1 } = extractLayer(frames, 0)
  side(f1, 'l', 'wall')
  side(f1, 'r', 'wall')
  front(b1, 'corridor')
  const { frontLayer: f2, backLayer: b2 } = extractLayer(frames, 2)
  side(f2, 'l', 'corridor')
  side(f2, 'r', 'corridor')
  front(b2, 'wall')
}
