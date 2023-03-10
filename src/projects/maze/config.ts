import p5 from "p5"

const colors: {[k: string]: p5.Color} = {}

export const Conf = {
  ww: 0,
  wh: 0,
  fps: 30,
  interval: 0, // ms between rendering frames. depends on fps
  magnifyRates: [
    1, 0.7, 0.3, 0.2, 0.09, 0.04, 0.02
  ],
  mapSizing: 0.66,
  pictureMagnify: 0.75,
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
  initColors()
}

const initColors = () => {
  Object.assign(colors, {
    fill: p.color(5, 250),
    stroke: p.color(180,200),
    mellowStroke: p.color(200,100),
    wallPicture: p.color(20, 120),
  })
  Conf.colors = colors
}

export const setColors = (conf: {[k: string]: p5.Color}) => {
  Object.assign(colors, conf)
  Object.assign(Conf, {colors})
  updateColors()
}

/**
 * increment alpha value of the current fill color.
 * @param val increment value to alpha
 */
export const fillTrans = (val: number) => {
  const c = Conf.colors.fill
  c.setAlpha(p.alpha(c) - val)
  updateColors()
}

const updateColors = () => {
  p.fill(Conf.colors.fill)
  p.stroke(Conf.colors.stroke)
}
