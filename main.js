#!/usr/bin/env node
'use strict'

const path = require( 'path' )

const Engine = require( path.join( __dirname, 'src', 'Engine' ) )

const meow = require( 'meow' )

const cli = meow(`
  Usage
    $ node-game [options]

  Options
    --level, -l       Level to load (not implemented)
    --fps, -f         Target FPS (default: 10)
    --standalone, -s  Stand-alone mode launches a new terminal for output (not implemented)
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
      'standalone':
      {
        type: 'boolean',
        alias: 's',
        default: false
      }
    }
  }
)


const { loadImage } = require( 'canvas' )

const PIXI = require( 'pixi.js' )

let engine = new Engine(
  {
    fps: cli.flags.fps,

    start: function ()
    {
      this.hamkey = PIXI.Sprite.from( 'hamkey2.jpg' )
      this.hamkey.anchor.set( 0.5 )
      this.hamkey.scale.set( 0.001 )
      this.hamkey.x = 100
      this.hamkey.y = 100

      this.app.stage.addChild( this.hamkey )
    },

    update: function ( deltaTime )
    {
      this.hamkey.rotation += 0.25 * deltaTime

      this.hamkey.scale.set( Math.abs( Math.sin( this.currentTime * 0.00025 ) * 0.2 ) )
    }
  }
)

engine.start()
