import aBURL, { ABURL } from '.'
import type { Options } from '.'

/**
 * Parser function that parses the URL and returns the parsed URL as an ABURL Object
 * @param {string} url - The string URL to parse
 * @warning Throws an error if the URL is invalid
 * @warning Does not support URLs with http authentication
 * @returns {ABURL} The ABURL object
 *
 * @example
 * const url = 'https://subDomain.example.com/api/v1/testing?firstName=John&lastName=Doe&age=25'
 * const parsedURL = parseURL(url)
 *
 **/

export function parseURL(url: string): ABURL {
  const urlPattern =
    /^(https?):\/\/((www)\.)?([^/?#:]+)(:(\d+))?([^?#]*)\??([^#]*)#?(.*)/

  const match = url.match(urlPattern)

  if (!match) {
    throw new Error('Invalid URL')
  }

  const scheme = match[1]
  const www = !!match[3]
  const fullHostname = match[4]
  const port = match[6] ? parseInt(match[6], 10) : undefined
  const path = match[7]
  const query = match[8]
  let fragment = match[9]

  if (!fullHostname) {
    throw new Error('Invalid URL')
  }
  const hostnameParts = fullHostname.split('.')
  const hostname = hostnameParts.slice(-2).join('.')
  const subdomains = hostnameParts.length > 2 ? hostnameParts.slice(0, -2) : []

  let directories: string[] = []
  if (path !== undefined) {
    directories = path.split('/').filter((dir) => dir.length > 0)
  }

  // Parse query parameters into an object

  let parameters: { [key: string]: string } = {}
  if (query !== undefined) {
    parameters = query.split('&').reduce(
      (params, param) => {
        const [key, value] = param.split('=')
        if (key && value) {
          params[key] = decodeURIComponent(value)
        }
        return params
      },
      {} as { [key: string]: string }
    )
  }

  if (fragment !== undefined && fragment.length > 0) {
    fragment = decodeURIComponent(fragment)
  } else fragment = undefined

  const options: Options = {
    HTTPS: scheme === 'https',
    www,
    subDomains: subdomains,
    directories,
    params: parameters,
    fragment: fragment,
    port: port,
  }
  return aBURL(hostname, options)
}
