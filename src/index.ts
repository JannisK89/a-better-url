export type ABURL = {
  base: string
  directories: string[]
  params: Record<string, string>
  url(): string
  updateParams(params: Record<string, string>): void
  removeParams(params: string[]): void
  getDirectories(): string[]
  getDirectoriesFlat(): string
  getParams(): Record<string, string>
  getParamsFlat(): string
  options: Options
}

type Options = {
  encodeParams?: boolean
  HTTPS?: boolean
  www?: boolean
}

const defaultOptions: Options = {
  encodeParams: false,
  HTTPS: true,
  www: false,
}

function mergeOptions(options?: Options): Options {
  return { ...defaultOptions, ...options }
}

/**
 * aBURL - A Better URL
 *
 * Create a URL object that can be used to build URLs without having to worry about string concatenation.
 *
 * @param {string} base - The base URL in the format of 'subDomain.example.com' or 'example.com'
 * @param {string[]} [directories] - An array of directories that will be concatenated to the base URL using '/'
 * @param {Record<string, string>} [params] - An object of parameters that will be added to the URL as query parameters
 * @param {Options} [options] - An object of options that can be used to modify the behavior of the URL
 * @returns {ABURL} The ABURL object
 *
 * @example
 * const bURL = aBURL('example.com', ['api', 'v1', 'testing'], { firstName: 'John', lastName: 'Doe', age: '25' });
 * console.log(bURL.url()); // Logs: 'https://example.com/api/v1/testing?firstName=John&lastName=Doe&age=25'
 *
 * @function url - Returns the full URL as a string"
 */
export default function aBURL(
  base: string,
  directories: string[] = [],
  params: Record<string, string> = {},
  options?: Options
): ABURL {
  const finalizedOptions = mergeOptions(options)
  return {
    base,
    directories,
    params,
    url: url,
    updateParams: updateParams,
    removeParams: removeParams,
    getDirectories: getDirectories,
    getDirectoriesFlat: getDirectoriesFlat,
    getParams: getParams,
    getParamsFlat: getParamsFlat,
    options: finalizedOptions,
  }
}

function url(this: ABURL) {
  const base = `${this.options.HTTPS ? 'https://' : 'http://'}${this.options.www ? 'www.' : ''}${this.base}/`
  const directories = `${this.directories.join('/')}`
  let params = ''

  if (Object.keys(this.params).length !== 0) {
    params = `?${Object.entries(this.params)
      .map(
        ([k, v]) =>
          `${k}=${this.options.encodeParams ? encodeURIComponent(v) : v}`
      )
      .join('&')}`
  }

  return `${base}${directories}${params}`
}

function updateParams(this: ABURL, params: Record<string, string>) {
  const newParams = { ...this.params, ...params }
  this.params = newParams
}

function removeParams(this: ABURL, params: string[]) {
  params.forEach((param) => {
    delete this.params[param]
  })
}

function getDirectories(this: ABURL) {
  return this.directories
}

function getDirectoriesFlat(this: ABURL) {
  return this.directories.join('/')
}

function getParams(this: ABURL) {
  return this.params
}

function getParamsFlat(this: ABURL) {
  return Object.entries(this.params)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
}
