const { cli } = require( '../main' )

const Engine = require( '../src/Engine' )

// const { loadImage } = require( 'canvas' )

const PIXI = require( 'pixi.js' )

let engine = new Engine(
  {
    fps: cli.flags.fps,

    moveAmount: 30,
    moveSpeed: 3,

    clearColor: 0x105090,

    multithreading: cli.flags.multithreading,

    start: function ()
    {
      this.hamkey = PIXI.Sprite.from( `${ __dirname }/hamkey2.jpg` )
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

      // if ( Math.abs( this.targetPositionX - ( this.canvas.width / 2 ) ) > this.canvas.width * 0.5 )
      // {
      //   this.targetPositionX = Engine.math.lerp(
      //     this.targetPositionX,
      //     this.canvas.width / 2,
      //     this.options.moveSpeed
      //       // * Math.abs( this.targetPositionX - ( this.canvas.width / 2 ) ) * 100
      //       * deltaTime
      //   )
      // }

      this.hamkey.x = Engine.math.clamp(
        Engine.math.lerp(
          this.hamkey.x,
          this.targetPositionX,
          this.options.moveSpeed * deltaTime
        ),

        this.hamkey.width / 2,
        
        this.canvas.width - ( this.hamkey.width / 2 )
      )

      this.hamkey.y = Engine.math.clamp(
        Engine.math.lerp(
          this.hamkey.y,
          this.targetPositionY,
          this.options.moveSpeed * deltaTime
        ),

        this.hamkey.height,
        
        this.canvas.height
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
