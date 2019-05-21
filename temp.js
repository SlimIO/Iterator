const iterator = require("./");
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
    for (let lineNo = 0; ;lineNo++) {
        next(`${lineNo}: ${yield}`);
    }
}

async function main() {
    await iterator.fromStream(createReadStream("./slimio.toml"),
        splitLines,
        iterator.tryOn(numberLines),
        iterator.whileOn(console.log)
    );
    console.log("done!");
}
main().catch(console.error);


