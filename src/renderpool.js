const imageToAscii = require( 'image-to-ascii' )


process.on( 'message', ( [ data, timestamp ] ) =>
  {
    imageToAscii( Buffer.from( data ), { colored: true }, ( err, converted ) =>
      {
        // should we ignore the error instead?
        // or write to a custom console?
        if ( err ) throw err

        process.send( [ ( converted.split( '\n' ) || [] ), timestamp ] )
      }
    )
  }
)
