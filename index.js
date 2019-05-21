// Require Third-party Dependencies
const is = require("@slimio/is");
const isStream = require("is-stream");

/**
 * @func chain
 * @desc Chain multiple generator functions
 * @param  {...any} generatorFuncs at least one generator function
 * @returns {any}
 */
function chain(...generatorFuncs) {
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

async function fromStream(stream, ...generatorFuncs) {
    if (!isStream(stream)) {
        throw new TypeError("stream must be a Node.js Stream!");
    }
    const target = chain(...generatorFuncs);

    for await (const buffer of stream) {
        target.next(buffer);
    }
    target.return();
}

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
    chain,
    fromStream,
    tryOn,
    whileOn,
    mergeAsyncIterator
};
