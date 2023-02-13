import { Conf } from "../config"

export type Frame = {
  tl: number[],
  tr: number[],
  bl: number[],
  br: number[]
}

export type Layer = {
  front: Frame
  back: Frame
}

const createFrame = (rectWH: number[]):Frame => {
  const h1 = (Conf.ww - rectWH[0]) / 2
  const h2 = h1 + rectWH[0]
  const v1 = (Conf.wh - rectWH[1]) / 2
  const v2 = v1 + rectWH[1]
  return {
    tl: [h1, v1],
    tr: [h2, v1],
    bl: [h1, v2],
    br: [h2, v2]
  }
}

export const frames = (magnify=1):Frame[] =>  
  Conf.magnifyRates.map(scale => {
    return createFrame(
      [
        Conf.ww*magnify*scale,
        Conf.wh*magnify*scale
      ]
    )
  }
)

export const assumeSecondFrame = (f: Frame):Frame => {
  const frameHeight = f.bl[1] - f.tl[1]
  const secondFrameBottom = f.bl[1] + frameHeight
  return {
    tl: f.bl,
    tr: f.br,
    bl: [f.bl[0], secondFrameBottom],
    br: [f.br[0], secondFrameBottom]
  }
}
