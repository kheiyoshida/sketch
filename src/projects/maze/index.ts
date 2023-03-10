import { renderHelp } from "./control/gui"
import { music } from "./sound"
import { start as toneStart } from 'tone'
import { Conf, initConf } from "./config"
import { bindControl, Control } from "./control"
import { callWallPicture } from "./render/wall"

let started = false

const setup = () => {
  initConf()
  const c = p.createCanvas(Conf.ww, Conf.wh)
  p.stroke(Conf.colors.stroke)
  p.fill(Conf.colors.fill)
  p.background(Conf.colors.fill)
  p.noLoop()
  p.touchStarted = () => false
  p.touchEnded = () => false
  p.touchMoved = () => false

  p.textSize(32)
  p.text('TAP/CLICK TO PLAY', 0, 32)

  const fadein = music()
  const start = () => {
    if (!started) {
      started = true
      setupMaze()
      toneStart()
      fadein()
    }
  }

  c.mousePressed(start)
  c.touchStarted(start)

  callWallPicture(
    [423.5, 269],
    [363, 231.29999],
    [6,0]
  )
}

const setupMaze = () => {
  const control = Control.init()
  bindControl(control)
  renderHelp(Conf.ww, Conf.wh)
}

export default <Sketch> {
  setup,
  draw: ()=>{},
}
