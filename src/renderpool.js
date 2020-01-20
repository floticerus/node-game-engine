const imageToAscii = require( 'image-to-ascii' )


function render( data, timestamp )
{
  imageToAscii( data, { colored: true }, ( err, converted ) =>
    {
      // should we ignore the error instead?
      // or write to a custom console?
      if ( err ) throw err

      process.send( [ ( converted.split( '\n' ) || [] ), timestamp ] )
    }
  )
}

process.on( 'message', ( [ data, timestamp ] ) =>
  {
    render( Buffer.from( data ), timestamp )
  }
)
