const { cli } = require( '../main' )

const Engine = require( '../src/Engine' )
const { PIXI } = Engine

const Weapon = require( './scripts/weapons/Weapon' )

// const { loadImage } = require( 'canvas' )

class Game extends Engine
{
  constructor( options = {} )
  {
    super( Object.assign(
      {
        fps: cli.fps,

        moveAmount: 30,
        moveSpeed: 3,

        clearColor: 0x105090,

        multithreading: cli.multithreading
      },

      options
    ))

    this._targetPosition = new PIXI.Point()
  }

  /** @type {PIXI.Point} */
  get targetPosition()
  {
    return this._targetPosition
  }

  set targetPosition( value )
  {
    const halfWidth = this.hamkey.width / 2

    this._targetPosition = Engine.math.clampv2(
      value,
      new PIXI.Point( halfWidth, this.hamkey.height ),
      new PIXI.Point(
        this.canvas.width - halfWidth,
        this.canvas.height
      )
    )
  }

  start()
  {
    super.start()

    this.player = new PIXI.Container()
    // this.player.pivot.set( 0.5, 1 )
    this.player.x = 100
    this.player.y = 100

    this.hamkey = PIXI.Sprite.from( `${ __dirname }/assets/hamkey2.jpg` )
    this.hamkey.anchor.set( 0.5, 1 )
    this.hamkey.scale.set( 0.1 )

    this.player.addChild( this.hamkey )

    this.weapon = new Weapon()
    this.weapon.y = -this.hamkey.height / 2

    this.player.addChild( this.weapon )

    this.app.stage.addChild( this.player )



    this.targetPosition = this.player.position

    this.input.on( 'a', this.pressedMoveLeft.bind( this ) )
    this.input.on( 'd', this.pressedMoveRight.bind( this ) )
    this.input.on( 'w', this.pressedMoveUp.bind( this ) )
    this.input.on( 's', this.pressedMoveDown.bind( this ) )

    this.input.on( 'left', this.pressedActionLeft.bind( this ) )
    this.input.on( 'right', this.pressedActionRight.bind( this ) )
    this.input.on( 'up', this.pressedActionUp.bind( this ) )
    this.input.on( 'down', this.pressedActionDown.bind( this ) )
  }

  update()
  {
    super.update()

    // this.hamkey.rotation += 0.25 * deltaTime

    // this.hamkey.scale.set( ( 0.75 + ( Math.abs( Math.sin( this.currentTime * 0.0006 ) ) * 0.25 ) ) * 0.1 )

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

    this.player.position = Engine.math.lerpv2(
      this.player.position,
      this.targetPosition,
      this.options.moveSpeed * this.deltaTime
    )
  }

  pressedMoveLeft()
  {
    this.targetPosition = new PIXI.Point(
      this.targetPosition.x -= this.options.moveAmount,
      this.targetPosition.y
    )
  }

  pressedMoveRight()
  {
    this.targetPosition = new PIXI.Point(
      this.targetPosition.x += this.options.moveAmount,
      this.targetPosition.y
    )
  }

  pressedMoveUp()
  {
    this.targetPosition = new PIXI.Point(
      this.targetPosition.x,
      this.targetPosition.y -= this.options.moveAmount
    )
  }

  pressedMoveDown()
  {
    this.targetPosition = new PIXI.Point(
      this.targetPosition.x,
      this.targetPosition.y += this.options.moveAmount
    )
  }

  pressedActionLeft()
  {
    this.weapon.rotation = 180 * PIXI.DEG_TO_RAD
  }

  pressedActionRight()
  {
    this.weapon.rotation = 0
  }

  pressedActionUp()
  {
    this.weapon.rotation = 270 * PIXI.DEG_TO_RAD
  }

  pressedActionDown()
  {
    this.weapon.rotation = 90 * PIXI.DEG_TO_RAD
  }
}

module.exports = Game
