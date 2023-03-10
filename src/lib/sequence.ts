
export type SeqFn = () => SeqFn|null
export type DrawFn = () => (DrawFn|null)[]

/**
 * Recursively run function having control of sequential frame rendering
 * 
 * @param moment Function that runs on each frame. 
 * It should return the next defined runtime or null 
 * (= reaching the base case of recursion).
 * Give the first runtime using moment()
 * 
 * @param interval 
 */
export const sequence = (
  moment: SeqFn,
  interval: number,
) => {
  const next = moment()
  if (next) {
    return setTimeout(
      () => {
        sequence(
          next,
          interval
        )
      },
      interval
    )
  }
}

/**
 * @param fnArr the collection of functions that should be run within frame
 * @param before function that runs each frame (typically the overdrawing of the screen)
 * @returns next runtime array
 */
export const moment = (
  fnArr: DrawFn[],
  before?: () => void,
  after?: () => void
) => {
  if (before) {
    before()
  }
  const results: DrawFn[] = []
  for (const fn of fnArr) {
    const r = fn()
    r.forEach(f => {
      if (f) results.push(f)
    })
  }
  if (after) {
    after()
  }
  if (!results.length) return null
  else return () => moment(results, before, after)
}
