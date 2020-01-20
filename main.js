#!/usr/bin/env node
'use strict'

const path = require( 'path' )

const Engine = require( path.join( __dirname, 'src', 'Engine' ) )

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


const { loadImage } = require( 'canvas' )

const PIXI = require( 'pixi.js' )

let engine = new Engine(
  {
    fps: cli.flags.fps,

    moveAmount: 25,
    moveSpeed: 1,

    clearColor: 0x105090,

    multithreading: cli.flags.multithreading,

    start: function ()
    {
      this.hamkey = PIXI.Sprite.from( 'hamkey2.jpg' )
      this.hamkey.anchor.set( 0.5, 1 )
      this.hamkey.scale.set( 0.001 )
      this.hamkey.x = 100
      this.hamkey.y = 100
      this.targetPositionX = this.hamkey.x
      this.targetPositionY = this.hamkey.y

      this.input.on( 'right-arrow', this.options.pressedRightArrow.bind( this ) )
      this.input.on( 'left-arrow', this.options.pressedLeftArrow.bind( this ) )
      this.input.on( 'up-arrow', this.options.pressedUpArrow.bind( this ) )
      this.input.on( 'down-arrow', this.options.pressedDownArrow.bind( this ) )

      this.app.stage.addChild( this.hamkey )
    },

    update: function ( deltaTime )
    {
      // this.hamkey.rotation += 0.25 * deltaTime

      this.hamkey.scale.set( ( 0.75 + ( Math.abs( Math.sin( this.currentTime * 0.0006 ) ) * 0.25 ) ) * 0.1 )

      this.hamkey.x = Engine.math.lerp(
        this.hamkey.x,
        this.targetPositionX,
        this.options.moveSpeed * deltaTime
      )

      this.hamkey.y = Engine.math.lerp(
        this.hamkey.y,
        this.targetPositionY,
        this.options.moveSpeed * deltaTime
      )
    },

    pressedRightArrow: function ()
    {
      this.targetPositionX += this.options.moveAmount
    },

    pressedLeftArrow: function ()
    {
      this.targetPositionX -= this.options.moveAmount
    },

    pressedUpArrow: function ()
    {
      this.targetPositionY -= this.options.moveAmount
    },

    pressedDownArrow: function ()
    {
      this.targetPositionY += this.options.moveAmount
    }
  }
)

engine.start()
