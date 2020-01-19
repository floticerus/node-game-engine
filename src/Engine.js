const path = require( 'path' )

const imageToAscii = require( 'image-to-ascii' )

const { fork } = require( 'child_process' )

let renderPool = []

let lastRenderedFrameTime = 0

function forkRenderThread()
{
  const worker = fork( path.join( __dirname, 'renderpool' ),
    {
      // stdio: 'inherit'
    }
  )

  worker.on( 'message', ( [ message, timestamp ] ) =>
    {
      if ( timestamp > lastRenderedFrameTime )
      {
        message.forEach( ( line, index ) => drawLine( line, index ) )

        lastRenderedFrameTime = timestamp
      }
    }
  )

  worker.on( 'exit', () =>
    {
      const index = renderPool.indexOf( worker )

      if ( index !== -1 )
        renderPool.splice( index, 1 )

      forkRenderThread()
    }
  )

  renderPool.push( worker )
}

let renderPoolQueue = 0

function drawLine( line, index )
{
	process.stdout.cursorTo( 0, index )
	process.stdout.clearLine()
  process.stdout.write( line )
}

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

// process.stdin.setRawMode( true )

// process.stdin.on( 'data', key =>
//   {
//     switch ( key.toString() )
//     {
//       case '\u0003':
//       {
//         return process.exit()
//       }


//     }
//   }
// )

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

        multithreading: false,

        clearColor: 0x000000
			},

			options
    )

    if ( this.options.multithreading )
    {
      require( 'os' ).cpus().forEach( forkRenderThread )
    }

    this.input = new Engine.Input(
      {

      }
    )

    this.canvas = createCanvas( 256, 256 )
    this.canvas.addEventListener = () => {}
    this.canvas.style = {}
    
    this.app = new PIXI.Application(
      {
        width: 256,
        height: 256,
        backgroundColor: this.options.clearColor,
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

    let buf

    try
    {
      buf = this.canvas.toBuffer()
    }

    catch ( err )
    {
      return // console.error( err )
    }

    if ( buf )
    {
      if ( this.options.multithreading )
      {
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

      else
      {
        imageToAscii( buf, ( err, converted ) =>
          {
            // should we ignore the error instead?
            // or write to a custom console?
            if ( err ) throw err

            const lines = converted.split( '\n' ) || []

            lines.forEach( ( line, index ) =>
              {
                if ( !this.lines[ index ] || this.lines[ index ] !== line )
                {
                  drawLine( line, index )
                }
              }
            )

            this.lines = lines

            process.stdout.cursorTo( 0, 0 )
          }
        )
      }
    }

    // const renderThread = getNextRenderThread()

    // if ( renderThread )
    // {
    //   try
    //   {
    //     renderThread.send( [ this.canvas.toBuffer(), this.currentTime ] )
    //   }

    //   catch ( err )
    //   {
    //     // console.log( err )
    //   }
    // }
	}
}

Engine.math = require( path.join( __dirname, 'math' ) )
Engine.Input = require( path.join( __dirname, 'Input' ) )

module.exports = Engine
