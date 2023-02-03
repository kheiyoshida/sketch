/**
 * create responsive canvas that handles windowResized events. 
 * useful when enbedding into webpage so that it persists its ratio and position. 
 */

export function windowResized() {
  p.resizeCanvas(p.windowWidth, p.windowHeight)
}

interface CanvasConfig {
  domId?:string
  fillWindow?:boolean,
  scale?: number,
  aspectRatio?: number[]
}

const calculateCanvasSize = () => {

}

// export const initResponsiveCanvas = (
//   p: p5, {
//     domId = 'canvas',
//     fillWindow=true, 
//     scale=1,
//     aspectRatio=[4,3]
//   }: CanvasConfig = {}) => {

//     if(fillWindow) { // always create canvas with same size as the window
//       canvasWidth = p.windowWidth
//       canvasHeight = p.windowHeight
//     } else { // create canvas based on aspect ratio / scale
//       canvasWidth = p.windowWidth * scale
//       canvasHeight = p.windowHeight * aspectRatio[1] / aspectRatio[0]
//     }
    
//   // createCanvas with computed widht/height
//   const canvas = p.createCanvas(canvasWidth, canvasHeight)
//   canvas.parent(domId)
//   return canvas
// }