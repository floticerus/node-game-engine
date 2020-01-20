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
  },

  '1': '1', '2': '2',
  '3': '3', '4': '4',
  '5': '5', '6': '6',
  '7': '7', '8': '8',
  '9': '9', '0': '0',

  a: 'a', A: 'a',
  b: 'b', B: 'b',
  c: 'c', C: 'c',
  d: 'd', D: 'd',
  e: 'e', E: 'e',
  f: 'f', F: 'f',
  g: 'g', G: 'g',
  h: 'h', H: 'h',
  i: 'i', I: 'i',
  j: 'j', J: 'j',
  k: 'k', K: 'k',
  l: 'l', L: 'l',
  m: 'm', M: 'm',
  n: 'n', N: 'n',
  o: 'o', O: 'o',
  p: 'p', P: 'p',
  q: 'q', Q: 'q',
  r: 'r', R: 'r',
  s: 's', S: 's',
  t: 't', T: 't',
  u: 'u', U: 'u',
  v: 'v', V: 'v',
  w: 'w', W: 'w',
  x: 'x', X: 'x',
  y: 'y', Y: 'y',
  z: 'z', Z: 'z',

  '`': '`',
  '~': '~',
  '!': '!',
  '@': '@',
  '#': '#',
  '$': '$',
  '%': '%',
  '^': '^',
  '&': '&',
  '*': '*',
  '(': ')',
  '-': '-',
  '_': '_',
  '=': '=',
  '+': '+',
  '[': '[',
  '{': '{',
  ']': ']',
  '}': '}',
  '\\': '\\',
  '|': '|',
  ';': ';',
  ':': ':',
  '\'': '\'',
  '"': '"',
  ',': ',',
  '<': '<',
  '.': '.',
  '>': '>',
  '/': '/',
  '?': '?'
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
