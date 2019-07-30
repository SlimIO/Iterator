"use strict";

// Require Third-party Dependencies
const is = require("@slimio/is");
const isStream = require("is-stream");

/**
 * @namespace Iterator
 */

/**
 * @function compose
 * @description Chain multiple generator functions
 * @memberof Iterator
 * @param  {...GeneratorFunction} generatorFuncs at least one generator function
 * @returns {Generator}
 */
function compose(...generatorFuncs) {
    if (generatorFuncs.length < 1) {
        throw new Error("Need at least 1 argument");
    }

    let generatorObject = null;
    let generatorFn = generatorFuncs[generatorFuncs.length - 1];
    if (is.generatorFunction(generatorFn)) {
        generatorObject = generatorFn();
        generatorObject.next();
    }

    for (let id = generatorFuncs.length - 2; id >= 0; id--) {
        generatorFn = generatorFuncs[id];
        if (!is.generatorFunction(generatorFn)) {
            continue;
        }
        generatorObject = generatorFn(generatorObject);
        generatorObject.next();
    }

    if (generatorObject === null) {
        throw new Error("Invalid generator chain..");
    }

    return generatorObject;
}

/**
 * @function tryOn
 * @description Surround generator with a Try/Finally and return the target automatically
 * @memberof Iterator
 * @param {!GeneratorFunction} generatorFunc generator
 * @returns {GeneratorFunction}
 */
function tryOn(generatorFunc) {
    if (!is.generatorFunction(generatorFunc)) {
        throw new TypeError("generatorFunc must be a Generator");
    }

    return function* tryIterator(target) {
        try {
            yield* generatorFunc((buf) => target.next(buf));
        }
        finally {
            target.return();
        }
    };
}

/**
 * @function whileOn
 * @description Iterate on a given handler
 * @memberof Iterator
 * @param {!Function} fn any function handler
 * @returns {GeneratorFunction}
 */
function whileOn(fn) {
    if (!is.func(fn)) {
        throw new TypeError("fn must be a Function");
    }

    return function* iterator() {
        while (true) {
            fn(yield);
        }
    };
}

/**
 * @async
 * @function fromStream
 * @description Create an Iterator from a given Node.js Stream (that must be Readable).
 * @memberof Iterator
 * @param {!any} stream a Node.js Read Stream
 * @param {!Generator} target target generator
 * @returns {Promise<void>}
 */
async function fromStream(stream, target) {
    if (!isStream(stream)) {
        throw new TypeError("stream must be a Node.js Stream!");
    }
    if (!is.generator(target)) {
        throw new TypeError("target must be a Generator");
    }

    for await (const buffer of stream) {
        target.next(buffer);
    }
    target.return();
}

/**
 * @template T
 * @async
 * @function mergeAsyncIterator
 * @description Merge all values of an Asynchronous Iterator in one complete Array
 * @param {!AsyncIterator<T>} iterator Asynchronous Iterator
 * @returns {Promise<T[]>}
 */
async function mergeAsyncIterator(iterator) {
    if (!is.asyncIterable(iterator)) {
        throw new TypeError("iterator must be an Asynchronous Iterator");
    }

    const ret = [];
    for await (const element of iterator) {
        ret.push(element);
    }

    return ret;
}

module.exports = {
    compose,
    fromStream,
    tryOn,
    whileOn,
    mergeAsyncIterator
};
