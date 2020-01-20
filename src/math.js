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
