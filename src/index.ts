import p5 from 'p5'

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
  // p.preload = () => (s.preload || p.preload)()
  // p.windowResized = () => (s.windowResized ||  p.windowResized)()
}


;(async function () {
  
  const PROJECT = process.env.PROJECT
  // const PROJECT = window.location.pathname
  const canvas = document.getElementById('canvas')

  if (!PROJECT) {
    throw Error('Project not defined')
  }

  if (!canvas) {
    throw Error('Canvas div not found')
  }
  
  const PJ = (await import(`./projects/${PROJECT}`)).default as Sketch
  const sketch = sketchFactory(PJ)

  global.p = new p5(
    sketch,
    canvas
  )
})()
