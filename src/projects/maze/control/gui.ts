import { pushPop } from "../../../lib/utils"

const btnFac = (base: number) => (
  text: string, x: number, y: number
) => {
  const btn = p.createDiv(text)
  btn.style('color', 'rgba(255,255,255,0.4)')
  btn.style('cursor', 'pointer')
  btn.style('letter-spacing', '0')
  btn.style('font-size', `${base}px`)
  btn.style('text-align', 'center')
  btn.style('width', `${base}px`)
  btn.style('user-select', 'none')
  btn.position(x,y)
  return btn
}

export const renderGUI = (ww: number, wh:number) => {
  const base = wh * 0.08
  const unit = wh * 0.095

  const createBtn = btnFac(base)
  const map = createBtn('M', ww/2-base/2, wh - unit-base/4)
  const up = createBtn('△', ww/2-base/2, wh - 2 * unit - base)
  const right = createBtn('⇨', ww/2+unit, wh-unit-base)
  const left = createBtn('⇦', ww/2-unit-base, wh-unit-base)
  
  return {
    map, up, right, left
  }
}

export const renderHelp = (ww: number, wh: number) => {
  const base = ww < 1000 ? wh * 0.04 : wh * 0.03
  const help = btnFac(base)('ⓘ', base, 1.5 * base)
  const render = () => {
    pushPop(() => {
      p.textSize(base/2)
      p.fill(200)
      p.text(
        `
        UP: MOVE\n
        LEFT/RIGHT: TURN\n
        ENTER/M/DOWN: OPEN MAP\n
        PAGE RELOAD: REGENERATE
        `,
        0,
        base
      )
    })
  }
  if (ww < 1000) {
    help.touchStarted(render)
  } else {
    help.mousePressed(render)
  }
}