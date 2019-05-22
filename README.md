# iterator
![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

Iterators utils

## Requirements
- Node.js v10 or higher

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
TBC

## License
MIT
