import { WebMidi } from "webmidi"
import { randomBetween } from "../../lib/utils"
import { bloom } from "../../lib/flower"

const preload = () => {

}


//  [144, 68, 100]
//  [128, 68, 64]

const doubleEdge = (length: number) => {
  p.stroke(155)
  p.line(-length/2, 0, length/2, 0)

  p.push()
  p.rotate(90)
  p.line(-length/2, 0, length/2, 0)
  p.pop()

  p.stroke(100)
  p.strokeWeight(1)
}

const signal = (tone: number) => {
  p.push()
  p.translate(p.windowWidth/2, p.windowHeight/2)
  p.rotate(p.millis())
  p.rotate(tone*5)
  doubleEdge(tone*30)
  const num = (tone % 5) + 9
  const pos = num / 2 - num
  bloom(pos, pos, {w: tone/3, len: tone*7, num})
  p.pop()
}


const setup = () => {
  p.createCanvas(p.windowWidth, p.windowHeight)
  p.background(0)
  p.strokeWeight(1)
  p.angleMode(p.DEGREES)

  WebMidi
    .enable({sysex: true})
    .then(() => {
      WebMidi.inputs.forEach(input => console.log(input.name))
      WebMidi.outputs.forEach(output => console.log(output.name))
      // const midiInput = WebMidi.getInputByName('Q Mini')!
      const midiInput = WebMidi.getInputByName('IAC Driver Bus 1')!
      midiInput.addListener("noteon", e => {
        // console.log(e.message.data)
        signal(e.message.data[1])
      })
      midiInput.addListener("noteoff", e => {
        // console.log(
        //   e.message.data
        // )
      })
    })
    .catch(err => alert(err))
  
  p.fill(255, 24)
}

const draw = () => {
  p.rect(0, 0, p.windowWidth, p.windowHeight)
}

export default <Sketch>{
  preload,
  setup,
  draw,
  windowResized: () => p.resizeCanvas(p.windowWidth, p.windowHeight)
}
