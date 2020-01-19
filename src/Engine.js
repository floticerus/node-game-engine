const path = require( 'path' )

const { fork } = require( 'child_process' )

let renderPool = []

require( 'os' ).cpus().forEach( () =>
  {
    renderPool.push( fork( path.join( __dirname, 'renderpool' ),
      {
        // stdio: 'inherit'
      }
    ))
  }
)

let renderPoolQueue = 0

function getNextRenderThread()
{
  if ( renderPool.length === 0 )
  {
    return null
  }

  if ( renderPoolQueue >= renderPool.length )
  {
    renderPoolQueue = 0
  }

  return renderPool[ renderPoolQueue++ ]
}

const { EventEmitter } = require( 'events' )

process.stdin.setRawMode( true )

process.stdin.on( 'data', key =>
  {
    switch ( key.toString() )
    {
      case '\u0003':
      {
        return process.exit()
      }


    }
  }
)

const jsdom = require( 'jsdom' )
const { JSDOM } = jsdom

const dom = new JSDOM()

global.window = dom.window
global.document = dom.window.document
global.Canvas = require( 'canvas' )
global.Image = global.Canvas.Image
global.window.CanvasRenderingContext2D = 'foo'
global.window.Element = undefined
global.navigator = { userAgent: 'custom' }

global.performance = {}
global.performance.now = require( 'performance-now' )

global.XMLHttpRequest = () => {}

const PIXI = require( 'pixi.js' )

const { createCanvas } = global.Canvas

const now = require( 'performance-now' )

class Engine extends EventEmitter
{
	constructor( options = {} )
	{
		super()

		this.options = Object.assign(
			{
        fps: 5,

        clearColor: '#000'
			},

			options
    )

    this.canvas = createCanvas( 200, 200 )
    this.canvas.addEventListener = () => {}
    this.canvas.style = {}
    
    this.app = new PIXI.Application(
      {
        width: 200,
        height: 200,
        backgroundColor: 0x000000,
        view: this.canvas
      }
    )
    
    this.currentTime = now()
    this.lastUpdateTime = 0
    this.deltaTime = 0

		this.updateLoop

		this.lines = []
	}

	start()
	{
    if ( this.updateLoop )
    {
      clearInterval( this.updateLoop )
    }

    console.clear()

    this.options.start && this.options.start.call( this )

    this.updateLoop = setInterval( this.update.bind( this ), 1000 / this.options.fps )
	}

	update()
	{
    this.currentTime = now()
    this.deltaTime = this.currentTime - this.lastUpdateTime
    this.deltaTime /= 1000 // convert to ms

    this.options.update && this.options.update.call( this, [ this.deltaTime ] )

    this.lastUpdateTime = this.currentTime

    const renderThread = getNextRenderThread()

    if ( renderThread )
    {
      try
      {
        renderThread.send( [ this.canvas.toBuffer(), this.currentTime ] )
      }

      catch ( err )
      {
        // console.log( err )
      }
    }
	}
}

module.exports = Engine
