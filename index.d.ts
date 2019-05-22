/// <reference types="@types/node" />

import * as Stream from "stream";

declare namespace Iterator {
    export function compose(...generatorFuncs: GeneratorFunction[]): Generator;
    export function tryOn(generatorFunc: GeneratorFunction): GeneratorFunction;
    export function whileOn(fn: Function): GeneratorFunction;
    export function fromStream(stream: Stream.Readable, target: Generator): Promise<void>;
    export function mergeAsyncIterator<T>(iterator: AsyncIterator<T>): T[];
}

export as namespace Iterator;
export = Iterator;
