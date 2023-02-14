import { random } from "../../../lib/utils"
import { randomBetween } from "../../sk_01/utils"

export const INITIAL_FLOOR_SIZE = 6
const MAX_FLOOR_SIZE = 16

/**
 * the deeper the player goes down, the floor must be larger.
 * but let's just keep it decently sized
 */
export const floorSize = (floor: number): number => {
  if (floor % 5 === 0) {
    return floor < MAX_FLOOR_SIZE ? floor : MAX_FLOOR_SIZE
  }
  if (floor < MAX_FLOOR_SIZE - INITIAL_FLOOR_SIZE) {
    return INITIAL_FLOOR_SIZE + floor
  } else {
    return MAX_FLOOR_SIZE
  }
}

const DEFAULT_FILL_RATE = 0.44

/**
 * the deeprer the player goes down, 
 * it must be more scarce alongside the floor's size.
 */
export const fillRate = (floor: number) => {
  if (floor % 5 === 0) {
    if (random(0.8) && floor % 10 === 0) {
      return 0.15
    } else {
      return 0.75
    }
  }
  if (floor < 5) {
    const min = {
      1: 0.1,
      2: 0.24,
      3: 0.30,
      4: 0.42
    }[floor]!
    return randomBetween(min, min+0.2)
  } else if (floor < 30) {
    return randomBetween(DEFAULT_FILL_RATE - floor/100, DEFAULT_FILL_RATE)
  } else {
    return randomBetween(0.25, 0.5)
  }
}

const DEFAULT_CONN_RATE = 0.5

/**
 * detemine the rate if adjacent nodes should connect.
 * 1) for the first few floors, it must be easier to explore.
 * 2) every 5-10 floors, user must face a honeycomb-like floor.
 */
export const connRate = (floor: number) => {
  if (floor % 5 === 0) {
    return 0.88
  }
  if (floor < 5) {
    return 0.25 + floor * 0.05
  } else {
    return randomBetween(DEFAULT_CONN_RATE-0.2, DEFAULT_CONN_RATE+0.1) 
  }
}
