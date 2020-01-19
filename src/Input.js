const { EventEmitter } = require( 'events' )

process.stdin.setRawMode( true )

const keyMap = {
  '\u0003': 'close',

  '\u001B\u005B\u0044': 'left-arrow',

  '\u001B\u005B\u0043': 'right-arrow',

  '\u001B\u005B\u0041': 'up-arrow',

  '\u001B\u005B\u0042': 'down-arrow'
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
    
    // key > [ listeners ]
    this.inputListeners = {}

		process.stdin.on( 'data', key =>
			{
        const keyString = key.toString()

        // console.log( `pressed key: ${ key }` )

        this.emit( keyString )

        if ( keyMap[ keyString ] )
        {
          this.emit( keyMap[ keyString ] )

          this.keyAction( keyMap[ keyString ] )
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

  /**
   * 
   * @param {string|symbol} event 
   * @param {(...args) void} listener 
   */
	// on( event, listener )
	// {
  //   return super.on( eventName, listener )
  // }
}

module.exports = Input
