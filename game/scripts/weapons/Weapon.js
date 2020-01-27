const Engine = require( '../../../src/Engine' )

class Weapon extends Engine.PIXI.Container
{
	constructor( options = {} )
	{
		super()

		this.options = Engine.util.merge.all([
			{
        rampDownSpeed: 8,

        activateCooldown: 200
			},

			options
    ])

    this.lastActivateTime = 0

    this.alpha = 0

    this.pendingActivateDirection = null

		this.graphic = new Engine.PIXI.Graphics()
		this.graphic.pivot.set( 0, 6 )
		this.graphic.beginFill( 0xffffff )
		this.graphic.lineStyle( 3, 0xff0000 )
		this.graphic.drawRect( 0, 0, 80, 12 )

		this.addChild( this.graphic )
	}

	activate( direction )
	{
    const currentTime = performance.now()

    if ( currentTime - this.lastActivateTime < this.options.activateCooldown )
    {
      this.pendingActivateDirection = direction

      if ( !this.pendingActivateTimeout )
      {
        this.pendingActivateTimeout = setTimeout( () =>
          {
            if ( this.pendingActivateDirection )
            {
              this.activate( this.pendingActivateDirection )

              this.pendingActivateDirection = null

              this.pendingActivateTimeout = null
            }
          },

          currentTime - this.lastActivateTime
        )
      }

      return
    }

    this.lastActivateTime = currentTime

		let rotation = PIXI.DEG_TO_RAD

		switch ( direction )
		{
		case 'left':
			rotation *= 180
			break
		case 'right':
		default:
			rotation *= 0
			break
		case 'up':
			rotation *= 270
			break
		case 'down':
			rotation *= 90
			break
		}

		this.rotation = rotation

    this.alpha = 1
  }
  
  update()
  {
    this.alpha = Engine.math.lerp(
      this.alpha,
      0,
      this.options.rampDownSpeed * Engine.instance.deltaTime
    )
  }
}

module.exports = Weapon
