/**
 * Created on 1401/1/5 (2022/3/25).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import assert from 'node:assert/strict'
import StringifyStream from '../src/main.js'

const tests = {
  null: null,
  false: false,
  true: true,
  0: 0,
  Integer: 123,
  'Decimal number': 1.23,
  'Empty string': '',
  'Integer as string': '123',
  'Decimal number as string': '12.3',
  '{}': {},
  '[]': [],
  Levels: [1, [[2, 3], 4], 5, 6],
  'Different types (Array)': ['Hello World!', 2, false, null],
  'Different types (Object)': {a: 1, b: 'hello world', c: true, d: null},
  'Object in Array': [[4], 5, [6], {a: 'سلام دنیا'}, {}],
  Complex: {a: [['h', 1, false, {a: [1], b: '3', c: true}]], b: 'x', c: [[]]},
}

for (const testName in tests) {
  await test(testName, tests[testName])
}
await test('`tests` object, itself', tests)

console.log('All tests are passed successfully.')

async function test(testName, input) {
  const stream = new StringifyStream(input)
  
  const buffers = []
  for await (const chunk of stream) {
    buffers.push(chunk)
  }
  
  const s = Buffer.concat(buffers).toString()
  const parsed = JSON.parse(s)
  assert.deepEqual(input, parsed)
  
  console.log('Passed:', testName)
}
