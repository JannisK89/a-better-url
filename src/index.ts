export type ABURL = {
  base: string
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
  directories?: string[]
  params?: Record<string, string>
  encodeParams?: boolean
  HTTPS?: boolean
  www?: boolean
}

const defaultOptions: Options = {
  directories: [],
  params: {},
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
 * @param {Options} [options] - An object of options that can be used to modify the behavior of the URL
 * @returns {ABURL} The ABURL object
 *
 * @example
  const exampleDotCom = aBURL('example.com', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: '25' },
  })
 * console.log(bURL.url()); // Logs: 'https://example.com/api/v1/testing?firstName=John&lastName=Doe&age=25'
 *
 */
export default function aBURL(base: string, options?: Options): ABURL {
  const finalizedOptions = mergeOptions(options)
  return {
    base,
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
  let directories = ''
  if (this.options.directories) {
    directories = `${this.options.directories.join('/')}`
  }
  let params = ''

  if (this.options.params && Object.keys(this.options.params).length !== 0) {
    params = `?${Object.entries(this.options.params)
      .map(
        ([k, v]) =>
          `${k}=${this.options.encodeParams ? encodeURIComponent(v) : v}`
      )
      .join('&')}`
  }

  return `${base}${directories}${params}`
}

function updateParams(this: ABURL, params: Record<string, string>) {
  const newParams = { ...this.options.params, ...params }
  this.options.params = newParams
}

function removeParams(this: ABURL, params: string[]) {
  params.forEach((param) => {
    if (this.options.params !== undefined) {
      delete this.options.params[param]
    }
  })
}

function getDirectories(this: ABURL) {
  if (this.options.directories === undefined) return []
  return this.options.directories
}

function getDirectoriesFlat(this: ABURL) {
  if (this.options.directories === undefined) return ''
  return this.options.directories.join('/')
}

function getParams(this: ABURL) {
  if (this.options.params === undefined) return {}
  return this.options.params
}

function getParamsFlat(this: ABURL) {
  if (this.options.params === undefined) return ''
  return Object.entries(this.options.params)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
}
