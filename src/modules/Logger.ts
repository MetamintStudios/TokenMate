const {Signale} = require('signale');

export function getLogger( level: string ){
    return new Signale({
        disabled: false,
        interactive: false,
        logLevel: level,
        secrets: [],
        stream: process.stdout,
      })
}