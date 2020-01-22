const { PIXI } = require( './Engine' )

/**
 * https://en.wikipedia.org/wiki/Linear_interpolation
 * 
 * @param {Number} from
 * @param {Number} to
 * @param {Number} alpha
 * 
 * @returns {Number}
 */
exports.lerp = ( from, to, alpha ) =>
{
  return ( 1 - alpha ) * from + alpha * to
}

/**
 * 
 * @param {PIXI.Point} from
 * @param {PIXI.Point} to
 * @param {Number} alpha
 * 
 * @returns {PIXI.Point}
 */
exports.lerpv2 = ( from, to, alpha ) =>
{
  return new PIXI.Point(
    this.lerp( from.x, to.x, alpha ),
    this.lerp( from.y, to.y, alpha )
  )
}

/**
 * @param {Number} input
 * @param {Number} min default: 0
 * @param {Number} max default: 1
 * 
 * @returns {Number} output
 */
exports.clamp = ( input, min = 0, max = 1 ) =>
{
  return input > min ? input < max ? input : max : min
}

/**
 * @param {PIXI.Point} input
 * @param {PIXI.Point} min default: 0
 * @param {PIXI.Point} max default: 1
 * 
 * @returns {PIXI.Point} output
 */
exports.clampv2 = ( input, min, max ) =>
{
  return new PIXI.Point(
    this.clamp( input.x, min.x, max.x ),
    this.clamp( input.y, min.y, max.y )
  )
}
