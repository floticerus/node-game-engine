const { cli } = require( '../main' )

const Engine = require( '../src/Engine' )
// const { PIXI } = Engine

const Player = require( './scripts/Player' )

// const { loadImage } = require( 'canvas' )

class Game extends Engine
{
  constructor( options = {} )
  {
    super( Engine.util.merge.all([
      {
        fps: cli.fps,

        clearColor: 0x1048b0,

        multithreading: cli.multithreading
      },

      options
    ]))


  }

  start()
  {
    super.start()

    this.player = new Player()
    this.player.x = 100
    this.player.y = 100
    this.player.targetPosition = this.player.position

    this.app.stage.addChild( this.player )
  }

  update()
  {
    super.update()

    this.player && this.player.update()
  }
}

module.exports = Game
