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

export const frames = (
  magnify: number,
  rates = Conf.magnifyRates
):Frame[] =>  
  rates.map(scale => {
    return createFrame(
      [
        Conf.ww*magnify*scale,
        Conf.wh*magnify*scale
      ]
    )
  }
)

export const extractLayer = (frames: Frame[], layer: number) => {
  const frontLayer: Layer = {front: frames[layer], back: frames[layer+1]} 
  const backLayer: Layer = {front: frames[layer+1], back: frames[layer+2]}
  return {
    frontLayer,
    backLayer
  }
}

export const frameWidthAndHeight = (f: Frame) => {
  return [
    (f.tr[0]-f.tl[0]),
    (f.bl[1]-f.tl[1])
  ]
}

export const heightDownFrame = (f: Frame, downRate: number): Frame => {
  const down = downRate * (f.bl[1] - f.tl[1])
  return {
    tl: [f.tl[0], f.tl[1]+down],
    tr: [f.br[0], f.bl[1]+down],
    bl: [f.bl[0], f.bl[1]+down],
    br: [f.br[0], f.br[1]+down]
  }
}

export const widenFrame = (f: Frame, rate: number): Frame => {
  const add = (f.tr[0] - f.tl[0]) * rate * 0.5
  return {
    tl: [f.tl[0]-add, f.tl[1]],
    tr: [f.br[0]+add, f.bl[1]],
    bl: [f.bl[0]-add, f.bl[1]],
    br: [f.br[0]+add, f.br[1]]
  }
}

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

export const wallPictureFrame = (f: Frame):Frame => {
  const originalHeight = f.bl[1] - f.tl[1]
  const originalWidth = f.tr[0] - f.tl[0]
  let width, height
  if (originalHeight > originalWidth) {
    width = originalWidth * Conf.pictureMagnify
    height = width 
  } else {
    height = originalHeight * Conf.pictureMagnify
    width = height 
  }
  const heightPadding = (originalHeight - height) * 0.5
  const widthPadding = (originalWidth - width) * 0.5
  return {
    tl: [f.tl[0] + widthPadding, f.tl[1] + heightPadding],
    tr: [f.tr[0] - widthPadding, f.tr[1] + heightPadding],
    bl: [f.bl[0] + widthPadding, f.bl[1] - heightPadding],
    br: [f.br[0] - widthPadding, f.br[1] - heightPadding]
  }
}
