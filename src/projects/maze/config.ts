import p5 from "p5"
import { randomBetween } from "../sk_01/utils"

const colors: {[k: string]: p5.Color} = {}

export const Conf = {
  ww: 0,
  wh: 0,
  fps: 30,
  interval: 300,
  magnifyRates: [
    1, 0.7, 0.3, 0.2, 0.09, 0.04, 0.02
  ],
  mapSizing: 0.5,
  colors,
}

/**
 * we can't set global config
 * while p5 is not instantiated, 
 * thus call this function in setup()
 */
export const initConf = () => {
  Conf.ww = p.windowWidth
  Conf.wh = p.windowHeight
  Conf.interval = 1000 / Conf.fps
  Conf.mapSizing = p.windowWidth < 1000 ? 0.88 : 0.6
  Object.assign(colors, {
    fill: p.color(0, 250),
    stroke: p.color(200,200),
  })
  Conf.colors = colors
}

export const setColors = (conf: {[k: string]: p5.Color}) => {
  Object.assign(colors, conf)
  Object.assign(Conf, {colors})
  updateColors()
}

export const fillTrans = (val: number) => {
  const c = Conf.colors.fill
  c.setAlpha(250 - val)
  updateColors()
}

const updateColors = () => {
  p.fill(Conf.colors.fill)
  p.stroke(Conf.colors.stroke)
}
