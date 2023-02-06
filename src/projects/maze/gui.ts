
export const renderGUI = (ww: number, wh:number) => {

  const base = wh * 0.08
  const unit = wh * 0.095

  const createBtn = (
    text: string, x: number, y: number
  ) => {
    const btn = p.createDiv(text)
    btn.style('color', 'rgba(255,255,255,0.5)')
    btn.style('cursor', 'pointer')
    btn.style('letter-spacing', '0')
    btn.style('font-size', `${base}px`)
    btn.style('text-align', 'center')
    btn.style('width', `${base}px`)
    btn.style('user-select', 'none')
    btn.position(x,y)
    return btn
  }
  
  const map = createBtn('M', ww/2-base/2, wh - unit-base/4)
  const up = createBtn('△', ww/2-base/2, wh - 2 * unit - base)
  const right = createBtn('⇨', ww/2+unit, wh-unit-base)
  const left = createBtn('⇦', ww/2-unit-base, wh-unit-base)
  
  return {
    map, up, right, left
  }
}
