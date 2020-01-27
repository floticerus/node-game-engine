const Engine = require( '../../src/Engine' )
const { PIXI, util, math } = Engine

const Weapon = require( './weapons/Weapon' )

class Player extends PIXI.Container
{
  constructor( options = {} )
  {
    super()

    this.options = util.merge.all([
      {
        moveAmount: 30,
        moveSpeed: 3
      },

      options
    ])

    this.sprite = PIXI.Sprite.from( `${ __dirname }/../assets/hamkey2.jpg` )
    this.sprite.anchor.set( 0.5, 1 )
    this.sprite.scale.set( 0.1 )

    this.addChild( this.sprite )

    this.weapon = new Weapon()
    this.weapon.y = -this.sprite.height / 2

    this.addChild( this.weapon )

    this.targetPosition = this.position

    Engine.instance.input.on( 'a', this.pressedMoveLeft.bind( this ) )
    Engine.instance.input.on( 'd', this.pressedMoveRight.bind( this ) )
    Engine.instance.input.on( 'w', this.pressedMoveUp.bind( this ) )
    Engine.instance.input.on( 's', this.pressedMoveDown.bind( this ) )

    Engine.instance.input.on( 'left', this.weapon.activate.bind( this.weapon, 'left' ) )
    Engine.instance.input.on( 'right', this.weapon.activate.bind( this.weapon, 'right' ) )
    Engine.instance.input.on( 'up', this.weapon.activate.bind( this.weapon, 'up' ) )
    Engine.instance.input.on( 'down', this.weapon.activate.bind( this.weapon, 'down' ) )
  }

  /** @type {PIXI.Point} */
  get targetPosition()
  {
    return this._targetPosition
  }

  set targetPosition( value )
  {
    const halfWidth = this.sprite.width / 2

    this._targetPosition = math.clampv2(
      value,
      new PIXI.Point( halfWidth, this.sprite.height ),
      new PIXI.Point(
        Engine.instance.canvas.width - halfWidth,
        Engine.instance.canvas.height
      )
    )
  }

  update()
  {
    this.position = Engine.math.lerpv2(
      this.position,
      this.targetPosition,
      this.options.moveSpeed * Engine.instance.deltaTime
    )

    this.weapon && this.weapon.update()
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
}

module.exports = Player
