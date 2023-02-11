import * as Tone from 'tone'
import { getScale, scaleNote } from '../../../lib/sound/helper'
import { randomBetween } from '../../sk_01/utils'
import { random } from '../../../lib/utils'
import { Filter } from 'tone'

export const music = () => {
  // setup
  Tone.Transport.bpm.value = 112
  const gain = new Tone.Gain()
  const bar = gain.toSeconds('1n')
  const mst = new Tone.Channel()
    .connect(new Tone.Compressor({attack: 0.2, ratio: 1.1, release: 0.2}))
    .connect(new Tone.Limiter(-1))
    .toDestination()
  mst.volume.value = -64
  const fadein = () => {
    Tone.Transport.start()
    mst.volume.rampTo(-1, '1n')
  }
  
  const scale = getScale('A#', 'omit27')
  const scale2 = getScale('F', 'omit47')

  // effects
  const filter = new Tone.Filter(800, 'bandpass')
  const filter2 = new Tone.Filter(800, 'highpass')
  const crusher = new Tone.BitCrusher(4)
  const reverbCh = new Tone.Channel().connect(mst)
  const reverb = new Tone.Reverb(0.8).connect(reverbCh)
  const feedbackDelay = new Tone.PingPongDelay('8n.', bar/4).fan(reverb, mst)
  

  // instruments
  const pad = new Tone.PolySynth(Tone.AMSynth).connect(filter).connect(mst)
  const poly = new Tone.PolySynth(Tone.Synth)
    .chain(filter2).connect(mst).connect(feedbackDelay)
  const kick = new Tone.MembraneSynth({volume: -8}).connect(mst)
  const tom = new Tone.MembraneSynth({volume: -14})
    .connect(crusher)
    .connect(filter2)
    // .connect(reverb)
    .fan(reverb, mst)
  

  // const noise = new Tone.Noise({volume: -40}).connect(new Filter({frequency: 1400, type: 'notch'})).fan(reverb, mst)
  
  // loops
  const loop2 = new Tone.Loop((time) => {
    const count = bar/4
    for (let i = 0; i<8; i++) {
      const t = time+i*count
      kick.triggerAttackRelease(24, '16n', t)
      if (random(0.1)) {
        kick.triggerAttackRelease(20, '16n', t+bar/8)
      }
      if (random(0.98)) {
        const hht = t+bar/8
        // noise.start(hht).stop(hht+0.06)
        // const delay = Math.floor(randomBetween(1, 3))
        // const hhtalt = t+bar/8+delay*bar/16
        // noise.start(hhtalt).stop(hhtalt+0.06)
      }
    }
  }, '2m')

  loop2.start(0)

  Tone.Transport.scheduleRepeat((time) => {
    kick.volume.rampTo(-40, '8m', '+32m')
    kick.volume.rampTo(-10, '8m', '+64m')
  }, '64m')

  pad.set({envelope: {attack: 0.2, release: 0.4}})
  Tone.Transport.scheduleRepeat((time) => {
    const tone = Math.floor(randomBetween(10,19))
    pad.triggerAttackRelease(scaleNote(tone, scale2), '1n', time, 0.5)
    pad.triggerAttackRelease(scaleNote(tone+2, scale), '1n', time, 0.5)
  }, '2n', 0)

  Tone.Transport.scheduleRepeat((time) => {
  pad.volume.rampTo(-10, '32m', '64m')
  pad.volume.rampTo(0,'32m', '128m')
}, '192m')

  poly.set({envelope: {attack: 0.2, decay: 0.4, sustain: 0.1, release: 0.4, releaseCurve: 'cosine'}})
  Tone.Transport.scheduleRepeat((time) => {
    const tone = Math.floor(randomBetween(18,28))
    const add = Math.floor(randomBetween(-4, 4))
    const velo = Math.floor(randomBetween(2, 4))*0.1
    poly.triggerAttackRelease(scaleNote(tone, scale), '4n', '+4n', velo)
    poly.triggerAttackRelease(scaleNote(tone+add, scale), '4n', '+4n', velo)
  }, '3n', 0)

  Tone.Transport.scheduleRepeat((time) => {
    // noise.volume.rampTo(-60, '32m', '64m')
    // noise.volume.rampTo(-40,'32m', '96m')
    poly.volume.rampTo(-50, '32m', '64m')
    poly.volume.rampTo(0,'32m', '96m')
  }, '128m')

  
  // const synth = new Tone.MonoSynth().connect(feedbackDelay).connect(mst);
  const synth2 = new Tone.MonoSynth().connect(feedbackDelay).connect(mst);
  // const genPart = () => {
  //   const tone = Math.floor(randomBetween(10,20))
  //   const part = new Tone.Part(((time, note) => {
  //     synth.triggerAttackRelease(note, "4n", time, 0.4)
  //   }), [
  //     [0, scaleNote(tone, scale)], 
  //     ["0:2", scaleNote(tone+2, scale)], 
  //   ]);
  //   return part
  // }

  // Tone.Transport.scheduleRepeat((time) => {
  //   const part = genPart()
  //   part.start(time)
  // }, '1n')

  const seq = new Tone.Sequence((time, note) => {
    synth2.triggerAttackRelease(note, '32n', time)
  }, [
    [`${scale[0]}5`,
    `${scale[1]}5`],
    `${scale[4]}4`,
    [`${scale[2]}5`,
    `${scale[3]}5`,],
    `${scale[4]}4`,
  ])
  seq.start()
  synth2.volume.value = -50

  Tone.Transport.scheduleRepeat((time) => {
    synth2.volume.rampTo(0, '16m', '+16m')
    synth2.volume.rampTo(-50, '32m', '+64m')
  }, '96m')
  
  return fadein
}