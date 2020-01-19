/**
 * https://en.wikipedia.org/wiki/Linear_interpolation
 * 
 * @param {Number} from
 * @param {Number} to
 * @param {Number} alpha
 */
exports.lerp = ( from, to, alpha ) =>
{
  return ( 1 - alpha ) * from + alpha * to
}
