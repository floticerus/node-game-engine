#!/usr/bin/env node
'use strict'

const path = require( 'path' )

const meow = require( 'meow' )

const cli = meow(`
  Usage
    $ node-game [options] path

  Options
    --level, -l           Level to load (not implemented)
    --fps, -f             Target FPS (default: 10)
    --multithreading, -m  Enables multithreading
    --standalone, -s      Stand-alone mode launches a new terminal for output (not implemented)
`,
  {
    flags:
    {
      'level':
      {
        type: 'string',
        alias: 'l'
      },
      'fps':
      {
        type: 'number',
        alias: 'f',
        default: 10
      },
      'multithreading':
      {
        type: 'boolean',
        alias: 'm',
        default: false
      },
      'standalone':
      {
        type: 'boolean',
        alias: 's',
        default: false
      }
    }
  }
)

exports.cli = cli

require( './game' )
