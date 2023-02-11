
const TONE_NAME = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const

const C1 = 24

export const convertToneNum = (midiNum: number) => {
  const num = midiNum - C1
  const noteName = TONE_NAME[num % 12]
  const ocatve = Math.floor(num / 12)
  return `${noteName}${ocatve}`
}

const SCALES = {
  major: [0,2,4,5,7,9,11],
  omit47: [0,2,4,7,9],
  harmonicMinor: [0,2,3,5,7,8,11],
  omit27: [0,4,5,9,11]
}

export const getScale = (
  root: (typeof TONE_NAME)[number],
  scaleName: keyof typeof SCALES = 'major'
) => {
  const scale = SCALES[scaleName]
  const rootIndex = TONE_NAME.indexOf(root)
  return scale.map( n => TONE_NAME[(rootIndex+n)%12] )
}

export const scaleNote = (
  n: number, 
  s: ReturnType<typeof getScale>
) => {
  const numOfNotes = s.length
  const noteName = s[n % numOfNotes]
  const octave = Math.floor(n / numOfNotes)
  return `${noteName}${octave}`
}
