#!/usr/bin/env node
'use strict'

const packageJSON = require( './package.json' )

const args = [
  {
    name: 'level',
    alias: 'l',
    type: String,
    description: 'Level to load (not implemented)'
  },

  {
    name: 'fps',
    alias: 'f',
    type: Number,
    defaultValue: 10,
    description: 'Target FPS'
  },

  {
    name: 'multithreading',
    alias: 'm',
    type: Boolean,
    defaultValue: false,
    description: 'Enables multithreading'
  },

  {
    name: 'standalone',
    alias: 's',
    type: Boolean,
    defaultValue: false,
    description: 'Stand-alone mode launches a new terminal for output (not implemented)'
  },

  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    defaultValue: false,
    description: 'Shows help information (this menu)'
  }
]

const commandLineArgs = require( 'command-line-args' )
const commandLineOptions = commandLineArgs( args )

if ( commandLineOptions.help )
{
  const commandLineUsage = require( 'command-line-usage' )

  return console.log( commandLineUsage(
    [
      {
        header: `${ packageJSON.name } v${ packageJSON.version }`,
        content: packageJSON.description
      },
  
      {
        header: 'Options',
  
        optionList: args.map( arg =>
          {
            return {
              name: `${ arg.name }${ arg.alias ? `, -${ arg.alias }` : '' }`,
              typeLabel: `{underline ${ arg.type.prototype.constructor.name }}`,
              description: `${ arg.description || '' }${ arg.hasOwnProperty( 'defaultValue' ) ? ` (default: ${ arg.defaultValue })` : '' }`
            }
          }
        )
      }
    ]
  ))
}

exports.cli = commandLineOptions

exports.Game = require( './game' )
exports.game = new exports.Game()

// autostart rendering
exports.game.start()
