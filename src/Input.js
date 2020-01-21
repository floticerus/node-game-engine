const { EventEmitter } = require( 'events' )

const readline = require( 'readline' )
readline.emitKeypressEvents( process.stdin )

process.stdin.setRawMode( true )

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

    process.stdin.on( 'keypress', ( str, key ) =>
      {
        if ( key.sequence === '\u0003' )
        {
          return process.exit()
        }

        const prepared = Input.prepareKey( key )

        this.emit( prepared )
      }
    )
  }

  static prepareKey( key )
  {
    let r = ''

    if ( key.ctrl )
      r += 'ctrl+'
    
    if ( key.meta )
      r += 'meta+'
    
    if ( key.shift )
      r += 'shift+'
    
    r += key.name

    return r
  }
  
  static keyAction( key )
  {
    switch ( key )
    {
      case 'close':
        return process.exit()
    }
  }
}

module.exports = Input
