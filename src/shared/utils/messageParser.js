import smartRounder from 'smart-round'
import config from '../../config'

/**
 * Perform an array of common replacements on strings
 * Each replacement is defined by an object of shape { search, replaceWith }
 * 'search' and 'replaceWith' are used as first and second argument of
 * String.prototype.replace() so the same specs apply.
 *
 * @param {string} str A message string.
 */
export function messageParser(str) {
  const replacements = [
    { search: config.MET_TOKEN_ADDR, replaceWith: 'MET TOKEN CONTRACT' },
    { search: config.CONVERTER_ADDR, replaceWith: 'CONVERTER CONTRACT' },
    { search: /(.*gas too low.*)/gim, replaceWith: () => 'Gas too low.' },
    {
      search: /(.*insufficient funds for gas \* price \+ value.*)/gim,
      replaceWith: () => "You don't have enough funds for this transaction."
    },
    {
      search: /(.*Insufficient\sfunds.*Required\s)(\d+)(\sand\sgot:\s)(\d+)(.*)/gim,
      // eslint-disable-next-line max-params
      replaceWith: (match, p1, p2, p3, p4, p5) => {
        const rounder = smartRounder(6, 0, 18)
        return [
          p1,
          rounder(p2, true),
          ' ETH',
          p3,
          rounder(p4, true),
          ' ETH',
          p5
        ].join('')
      }
    }
  ]

  return replacements.reduce(
    (output, { search, replaceWith }) => output.replace(search, replaceWith),
    str
  )
}

