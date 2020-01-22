const Engine = require( '../../../src/Engine' )

class Weapon extends Engine.PIXI.Container
{
	constructor( options = {} )
	{
		super()

		this.options = Object.assign(
			{

			},

			options
		)

		this.graphic = new Engine.PIXI.Graphics()
		this.graphic.pivot.set( 0, 6 )
		this.graphic.beginFill( 0xffffff )
		this.graphic.lineStyle( 3, 0xff0000 )
		this.graphic.drawRect( 0, 0, 80, 12 )

		this.addChild( this.graphic )
	}

	
}

module.exports = Weapon
