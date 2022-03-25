/**
 * Created on 1401/1/5 (2022/3/25).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {Readable} from 'node:stream'

export default class StringifyStream extends Readable {
  deepLevel
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
    this.deepLevel = deepLevel
    if (!instance || typeof instance !== 'object' || deepLevel < 1) {
      this.push(JSON.stringify(instance))
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
    return this.#current
  }
  
  nextChild() {
    this.#current.i++
    this.#current.child = this.#current.isArray
      ? this.#current.instance[this.#current.i]
      : this.#current.instance[this.#current.keys[this.#current.i]]
    return this.#current.child
  }
  
  _read(size) { // eslint-disable-line @typescript-eslint/no-unused-vars
    streaming: while (true) {
      const {size: n, isArray, keys, begin, end, i, child} = this.#current
      const currentLevel = this.#currents.length
      
      if (i === 0) this.push(begin)
      
      if (i === n) {
        this.push(end)
        
        if (currentLevel === 1) // should always be >= 1
          return this.push(null)
        
        const nextCurrent = this.popCurrent()
        let nextChild
        do {
          nextChild = this.nextChild()
          if (nextCurrent.i === nextCurrent.size) {
            continue streaming
          }
        } while (nextChild === undefined)
        
        return this.push(',')
      }
      
      if (
        currentLevel < this.deepLevel &&
        typeof child === 'object' && child // https://stackoverflow.com/questions/18808226/why-is-typeof-null-object#answer-18808270
      ) {
        this.pushCurrent(child)
        if (!isArray)
          this.push(JSON.stringify(keys[i]) + ':')
        continue // streaming
      }
      
      if (child !== undefined) {
        const value = JSON.stringify(child)
        this.push(isArray
          ? value
          : JSON.stringify(keys[i]) + ':' + value)
      }
      
      let nextChild
      do {
        nextChild = this.nextChild()
        
        if (this.#current.i === n) 
          continue streaming
      } while (nextChild === undefined)
      
      if (child !== undefined)
        this.push(',')
    }
  }
}
