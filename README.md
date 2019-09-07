# iterator
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/iterator/master/package.json?token=AOgWw3vrgQuu-U4fz1c7yYZyc7XJPNtrks5catjdwA%3D%3D&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/iterator/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![dep](https://img.shields.io/david/SlimIO/Iterator)
![size](https://img.shields.io/bundlephobia/min/@slimio/iterator)
[![Known Vulnerabilities](https://snyk.io//test/github/SlimIO/Iterator/badge.svg?targetFile=package.json)](https://snyk.io//test/github/SlimIO/Iterator?targetFile=package.json)
[![Build Status](https://travis-ci.com/SlimIO/Iterator.svg?branch=master)](https://travis-ci.com/SlimIO/Iterator) [![Greenkeeper badge](https://badges.greenkeeper.io/SlimIO/Iterator.svg)](https://greenkeeper.io/)

SlimIO Iterator utilities designed to manage and help developer to interact with iterators to release **lazy** code.

## Requirements
- [Node.js](https://nodejs.org/en/) v10 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/iterator
# or
$ yarn add @slimio/iterator
```

## Usage example
```js
const { fromStream, tryOn, whileOn, compose } = require("@slimio/iterator");
const { createReadStream } = require("fs");

function* splitLines(target) {
    let previous = "";
    try {
        while (true) {
            previous += yield;
            let eolIndex;
            while ((eolIndex = previous.indexOf("\n")) >= 0) {
                target.next(previous.slice(0, eolIndex));
                previous = previous.slice(eolIndex + 1);
            }
        }
    }
    finally {
        if (previous.length > 0) {
            target.next(previous);
        }
        target.return();
    }
}

function* numberLines(next) {
    for (let lineCount = 0; ;lineCount++) {
        next(`${lineCount}: ${yield}`);
    }
}

const fileToRead = process.argv[2];
fromStream(
    createReadStream(fileToRead), compose(splitLines, tryOn(numberLines), whileOn(console.log))
).then(() => console.log("done")).catch(console.error);
```

## API

<details><summary>compose(...generatorFuncs: GeneratorFunction[]): Generator</summary>
<br />

</details>

<details><summary>tryOn(generatorFunc: GeneratorFunction): GeneratorFunction</summary>
<br />

</details>


<details><summary>whileOn(fn: Function): GeneratorFunction</summary>
<br />

</details>


<details><summary>fromStream(stream: Stream.Readable, target: Generator): Promise< void ></summary>
<br />

</details>


<details><summary>mergeAsyncIterator< T >(iterator: AsyncIterator< T >): T[];</summary>
<br />

</details>

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[@slimio/is](https://github.com/SlimIO/is#readme)|Minor|Low|Type checker|
|[is-stream](https://github.com/sindresorhus/is-stream#readme)|⚠️Major|Medium|Stream type checker|


## License
MIT
