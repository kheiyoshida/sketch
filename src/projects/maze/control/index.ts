import { Conf, fillTrans, setColors } from "../config"
import { Mapper } from "../core/mapper"
import { Maze } from "../core/maze"
import { frames } from "../render/frame"
import { renderGUI } from "./gui"
import { goDownStairsMove, goMove, turnMove } from "../render/move"
import { render } from "../render"
import { renderMap } from "../render/map"

export class Control {
  // singleton
  private static instance: Control

  // composite core features
  private maze: Maze
  private mapper: Mapper

  private constructor() {
    this.maze = new Maze()
    this.mapper = new Mapper(this.maze)
    this.renderCurrentView()
  }

  public static init(): Control {
    if (!Control.instance) {
      Control.instance = new Control()
    }
    return Control.instance
  }
  
  public renderCurrentView() {
    render(frames(1), this.maze)
  }

  public go() {
    if (!this.maze.canProceed) return
    goMove(
      this.maze,
      () => {
        const res = this.maze.navigate()
        if (res) {
          this.mapper.track(res)
        }
        this.renderCurrentView()
        if (this.maze.reachedStair) {
          this.goDownStairs()
        }
      }
    )
  }

  public goDownStairs() {
    goDownStairsMove(
      this.maze, 
      () => {
        fillTrans(this.maze.floor * 0.3)
        this.maze.goDownStairs()
        this.renderCurrentView()
        this.mapper.reset(this.maze)
      }
    )
  }

  public turn(dir: 'r'|'l') {
    turnMove(
      this.maze, 
      dir, 
      () => {
        this.maze.turn(dir)
        this.renderCurrentView()
      }
    )
  }

  private mapOpen = false
  public callMap() {
    if (!this.mapOpen) {
      renderMap(
        this.mapper.grid,
        this.maze.current,
        this.maze.direction,
        this.maze.floor,
      )
      this.mapOpen = true
    } else {
      this.renderCurrentView()
      this.mapOpen = false
    } 
  }
}

export const bindControl = (control: Control) => {
  if (Conf.ww < 1000) {
    const {map, up, right, left} = renderGUI(Conf.ww, Conf.wh)
    map.touchStarted(() => control.callMap())
    up.touchStarted(() => control.go())
    right.touchStarted(() => control.turn('r'))
    left.touchStarted(() => control.turn('l'))
  } else {
    const keyCodeMap = {
      [p.UP_ARROW]: () => control.go(),
      [p.RIGHT_ARROW]: () => control.turn('r'),
      [p.LEFT_ARROW]: () => control.turn('l'),
      [p.DOWN_ARROW]: () => control.callMap(),
      [p.ENTER]: () => control.callMap(),
    } as const
    const keyMap = {
      'm': () => control.callMap(),
      'w': () => control.go(),
      'a': () => control.turn('l'),
      's': () => control.callMap(),
      'd': () => control.turn('r'),
    } as const
    p.keyPressed = () => {
      if (p.keyCode in keyCodeMap) {
        keyCodeMap[p.keyCode]()
      }
      if (p.key in keyMap) {
        keyMap[p.key as keyof typeof keyMap]()
      }
    }
  }
}