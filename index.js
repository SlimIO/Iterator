function chain(...generatorFuncs) {
    if (generatorFuncs.length < 1) {
        throw new Error("Need at least 1 argument");
    }

    let generatorObject = generatorFuncs[generatorFuncs.length - 1]();
    generatorObject.next();

    for (let id = generatorFuncs.length - 2; id >= 0; id--) {
        const generatorFn = generatorFuncs[id];
        generatorObject = generatorFn(generatorObject);
        generatorObject.next();
    }

    return generatorObject;
}

function fTry(iterator) {
    return function* tryIterator(target) {
        try {
            yield* iterator((buf) => target.next(buf));
        }
        finally {
            target.return();
        }
    };
}

function whileOn(fn) {
    return function* iterator() {
        while (true) {
            fn(yield);
        }
    };
}

async function fromStream(stream, ...generatorFuncs) {
    const target = chain(...generatorFuncs);

    for await (const buffer of stream) {
        target.next(buffer);
    }
    target.return();
}

async function mergeAsync(asyncIterator) {
    const ret = [];

    for await (const element of asyncIterator) {
        ret.push(element);
    }

    return ret;
}

module.exports = {
    chain,
    fromStream,
    fTry,
    whileOn,
    mergeAsync
};
