/**
 * Created on 1401/1/5 (2022/3/25).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {Readable} from 'node:stream'

export default class StringifyStream extends Readable {
  #instance
  #deepLevel
  #current
  #currents = []
  
  /**
   * @param {{},[],boolean,number,string,null} instance - Any valid JSON value
   * @param {number} [deepLevel=Number.POSITIVE_INFINITY] - Determines how many levels the streamer should
   *   (recursively) dive into the `instance`. If not set (defaults to `POSITIVE_INFINITY`) it automatically traverses
   *   until reaches *leaves (non-{`Object`|`Array`} nodes)*. Then use native `JSON.stringify()` there.
   * @param {ReadableOptions} [options]
   */
  constructor(instance, deepLevel = Number.POSITIVE_INFINITY, options) {
    super(options)
    this.#instance = instance
    this.#deepLevel = deepLevel
    if (!instance || typeof instance !== 'object' || deepLevel < 1) {
      this.push(JSON.stringify(this.#instance))
      this.push(null)
      return this
    }
    this.pushCurrent(instance)
  }
  
  pushCurrent(instance) {
    const isArray = Array.isArray(instance)
    const keys = isArray ? [] : Object.keys(instance)
    this.#current = {
      instance,
      isArray,
      keys,
      size: isArray ? instance.length : keys.length,
      begin: isArray ? '[' : '{',
      end: isArray ? ']' : '}',
      /**
       * Will be increased until `size`
       */
      i: 0,
      /**
       * Will be iterated through `instance`'s children
       */
      child: isArray ? instance[0] : instance[keys[0]],
    }
    this.#currents.push(this.#current)
  }
  
  popCurrent() {
    this.#currents.pop()
    this.#current = this.#currents.at(-1)
    this.nextChild()
  }
  
  nextChild() {
    this.#current.i++
    this.#current.child = this.#current.isArray
      ? this.#current.instance[this.#current.i]
      : this.#current.instance[this.#current.keys[this.#current.i]]
  }
  
  _read(size) { // eslint-disable-line @typescript-eslint/no-unused-vars
    while (true) {
      const {size: n, isArray, keys, begin, end, i, child} = this.#current
      const currentLevel = this.#currents.length
      
      if (i === 0) {
        this.push(begin)
      }
      if (i === n) {
        this.push(end)
        if (currentLevel === 1) {
          this.push(null)
          break
        }
        this.popCurrent()
        if (this.#current.i === this.#current.size) {
          continue
        }
        this.push(',')
        break
      }
      
      if (
        currentLevel < this.#deepLevel &&
        typeof child === 'object' && child // https://stackoverflow.com/questions/18808226/why-is-typeof-null-object#answer-18808270
      ) {
        this.pushCurrent(child)
        if (!isArray) {
          this.push(JSON.stringify(keys[i]) + ':')
        }
        continue
      }
      
      const value = JSON.stringify(child)
      this.push(isArray
        ? value
        : JSON.stringify(keys[i]) + ':' + value)
      
      this.nextChild()
      if (i === n - 1) {
        continue
      }
      this.push(',')
      break
    }
  }
}
