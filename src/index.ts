import p5 from 'p5'
import { published } from './web/pub'
import { home } from './web'

declare global {
  var p: p5
  
  type Sketch = {
    setup: () => void
    draw: () => void
    preload?: () => void
    windowResized?: () => void
  }
}

/**
 * returns a function that binds drawing functions with p5 instance.
 */
const sketchFactory = (s: Sketch) => (p:p5) => {
  p.setup = () => s.setup()
  p.draw = () => s.draw()
  p.preload = s.preload || (() => {})
  // p.windowResized = () => (s.windowResized ||  p.windowResized)()
}


;(async function () {
  
  const canvas = document.getElementById('canvas')
  if (!canvas) {
    throw Error('Canvas div not found')
  }

  const path = window.location.pathname
  
  if (published.some( p => p.path === path.slice(1))) {
    const PJ = (await import(`./projects${path}`)).default as Sketch
    const sketch = sketchFactory(PJ)
  
    global.p = new p5(
      sketch,
      canvas
    )
  }
  else {
    home()
  }
})()
