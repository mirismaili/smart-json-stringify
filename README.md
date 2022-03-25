# Smart Json Stringify (`stream`)

> A native and modern node.js **readable-stream** to stringify objects at any sizes, **without any third-party dependency**
> 
> *With a **custom-deep-level** option to improve **performance (speed)** if necessary*

[![npm (scoped)](https://img.shields.io/npm/v/smart-json-stringify.svg)](https://npmjs.com/package/smart-json-stringify)
[![install size](https://packagephobia.now.sh/badge?p=smart-json-stringify)](https://packagephobia.now.sh/result?p=smart-json-stringify)
[![downloads](https://img.shields.io/npm/dt/smart-json-stringify.svg)](https://npmjs.com/package/smart-json-stringify) <br>
[![license](https://img.shields.io/github/license/mirismaili/smart-json-stringify.svg)](https://github.com/mirismaili/smart-json-stringify/blob/master/LICENSE)
[![Forks](https://img.shields.io/github/forks/mirismaili/smart-json-stringify.svg?style=social)](https://github.com/mirismaili/smart-json-stringify/fork)
[![Stars](https://img.shields.io/github/stars/mirismaili/smart-json-stringify.svg?style=social)](https://github.com/mirismaili/smart-json-stringify)

```bash
npm i smart-json-stringify
```

or:

```bash
yarn add smart-json-stringify
```

## Usage

```javascript
import StringifyStream from 'smart-json-stringify'

const stream = new StringifyStream(bigJavascriptObject)
```
