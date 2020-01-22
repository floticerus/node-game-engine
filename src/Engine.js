const path = require( 'path' )

const imageToAscii = require( 'image-to-ascii' )

const { fork } = require( 'child_process' )

let renderPool = []

let lastRenderedFrameTime = 0

function forkRenderThread()
{
  const worker = fork( `${ __dirname }/renderpool.js`,
    {
      // stdio: 'inherit'
    }
  )

  worker.on( 'message', ( [ message, timestamp ] ) =>
    {
      if ( !Engine.instance )
      {
        return
      }

      if ( timestamp > lastRenderedFrameTime )
      {
        message.forEach( ( line, index ) =>
          {
            if ( !Engine.instance.lines[ index ] || Engine.instance.lines[ index ] !== line )
            {
              drawLine( line, index )
            }
          }
        )

        Engine.instance.lines = message

        process.stdout.cursorTo( 0, 0 )

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

process.on( 'SIGWINCH', () =>
  {
    Engine.instance && Engine.instance.refreshLines()
  }
)

process.on( 'exit', () =>
  {
    renderPool.forEach( child => child.kill() )
  }
)

let renderPoolQueue = 0

const stripAnsi = require( 'strip-ansi' )

function drawLine( line, index )
{
  process.stdout.cursorTo( 0, index )
  process.stdout.clearLine()
  
  let lineString = line.toString( 'utf-8' )

  // center text
  let centered = ''

  const width = process.stdout.columns || 80
  // const height = process.stdout.rows || 24

  // horizontal center
  for ( let i = 0, l = ( width / 2 ) - ( stripAnsi( lineString ).length / 2 ); i < l; i++ )
  {
    centered += ' '
  }

  centered += lineString

  process.stdout.write( Buffer.from( centered ) )
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
    
    // singleton :(
    Engine.instance = this

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

    // const [ width, height ] = [
    //   process.stdout.columns || 80,
    //   process.stdout.rows || 24
    // ]

    this.canvas = createCanvas(
      256 * ( 4 / 3 ),
      256
    )

    this.canvas.addEventListener = () => {}
    this.canvas.style = {}
    
    this.app = new PIXI.Application(
      {
        width: this.canvas.width,
        height: this.canvas.height,
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

    this.options.update && this.options.update.call( this )

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
        imageToAscii( buf, { colored: true }, ( err, converted ) =>
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
  }
  
  refreshLines()
  {
    this.lines.forEach( drawLine )
  }
}

Engine.instance = null

module.exports = Engine

Engine.PIXI = require( 'pixi.js' )

Engine.math = require( './math' )
Engine.Input = require( './Input' )
