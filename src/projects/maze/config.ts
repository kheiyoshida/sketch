import p5 from "p5"

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

export const initConf = () => {
  Conf.ww = p.windowWidth
  Conf.wh = p.windowHeight
  Conf.interval = 1000 / Conf.fps
  Conf.mapSizing = p.windowWidth < 1000 ? 0.88 : 0.6
  Conf.colors = {
    bg: p.color(0, 250),
    fill: p.color(0, 250),
    stroke: p.color(200,200),
  }
}
