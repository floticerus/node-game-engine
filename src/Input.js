const { EventEmitter } = require( 'events' )

process.stdin.setRawMode( true )

const keyMap = {
  '\u0003': 'close',

  '\u001B':
  {
    '\u005B':
    {
      '\u0044': 'left-arrow',
      '\u0043': 'right-arrow',
      '\u0041': 'up-arrow',
      '\u0042': 'down-arrow'
    }
  }
}

/**
 * 
 * @param {Buffer|string} key 
 */
function getKeyFromMap( key, map )
{
  key = Buffer.isBuffer( key ) ? key.toString() : key

  map = map || keyMap

  for ( let i = 0; i < key.length; i++ )
  {
    if ( map[ key[ i ] ] )
    {
      if ( Object.prototype.toString.call( map[ key[ i ] ] ) === '[object String]' )
      {
        return map[ key[ i ] ]
      }

      else
      {
        return getKeyFromMap( key.substring( 1 ), map[ key[ i ] ] )
      }
    }
  }

  return null
}

class Input extends EventEmitter
{
	constructor( options = {} )
	{
		super()

		this.options = Object.assign(
			{
        
			},

			options
    )

		process.stdin.on( 'data', key =>
			{
        const mapped = getKeyFromMap( key )

        if ( mapped )
        {
          this.emit( mapped )

          this.keyAction( mapped )
        }
			}
		)
  }
  
  keyAction( key )
  {
    switch ( key )
    {
      case 'close':
        return process.exit()
    }
  }
}

module.exports = Input
