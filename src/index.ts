export { parseURL } from './parser'

export type ABURL = {
  base: string
  url(): string
  updateParams(params: Record<string, string | number>): void
  toUpdatedParams(params: Record<string, string | number>): ABURL
  removeParams(params: string[]): void
  toRemovedParams(params: string[]): ABURL
  getDirectories(): string[]
  getDirectoriesFlat(): string
  getParams(): Record<string, string | number>
  getParamsFlat(): string
  setSubDomains(value: string[] | undefined): void
  useWWW(value: boolean): void
  useHTTPS(value: boolean): void
  setPort(value: number | undefined): void
  setAuth(value: { username: string; password: string } | undefined): void
  setFragment(value: string | undefined): void
  options: Options
}

export type Options = {
  directories?: string[]
  params?: Record<string, string | number>
  encodeParams?: boolean
  HTTPS?: boolean
  www?: boolean
  port?: number
  auth?: { username: string; password: string }
  subDomains?: string[]
  fragment?: string
}

const defaultOptions: Options = {
  directories: [],
  params: {},
  encodeParams: false,
  HTTPS: true,
  www: false,
  port: undefined,
  auth: undefined,
  subDomains: [],
  fragment: undefined,
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
    toUpdatedParams: toUpdatedParams,
    removeParams: removeParams,
    toRemovedParams: toRemovedParams,
    getDirectories: getDirectories,
    getDirectoriesFlat: getDirectoriesFlat,
    getParams: getParams,
    getParamsFlat: getParamsFlat,
    setSubDomains: setSubDomains,
    useWWW: useWWW,
    useHTTPS: useHTTPS,
    setPort: setPort,
    setFragment: setFragment,
    setAuth: setAuth,
    options: finalizedOptions,
  }
}

function url(this: ABURL) {
  const scheme = this.options.HTTPS ? 'https://' : 'http://'
  const www = this.options.www ? 'www.' : ''
  const port = this.options.port ? `:${this.options.port}` : ''
  const fragment = this.options.fragment ? `#${this.options.fragment}` : ''
  const auth =
    this.options.auth !== undefined
      ? `${this.options.auth.username}:${this.options.auth.password}@`
      : ''

  let subDomains = ''

  if (this.options.subDomains && this.options.subDomains.length !== 0) {
    subDomains = `${this.options.subDomains.join('.')}.`
  }

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

  return `${scheme}${www}${auth}${subDomains}${this.base}${port}/${directories}${params}${fragment}`
}

function updateParams(this: ABURL, params: Record<string, string>) {
  const newParams = { ...this.options.params, ...params }
  this.options.params = newParams
}

function toUpdatedParams(this: ABURL, params: Record<string, string>) {
  const newParams = { ...this.options.params, ...params }
  const newBurl = aBURL(this.base, { ...this.options, params: newParams })
  return newBurl
}

function removeParams(this: ABURL, params: string[]) {
  params.forEach((param) => {
    if (this.options.params !== undefined) {
      delete this.options.params[param]
    }
  })
}

function toRemovedParams(this: ABURL, params: string[]) {
  const newBurl = {
    ...this,
    options: {
      ...this.options,
      params: structuredClone(this.options.params),
      directories: structuredClone(this.options.directories),
    },
  }
  params.forEach((param) => {
    if (newBurl.options.params !== undefined) {
      delete newBurl.options.params[param]
    }
  })
  return newBurl
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

function useHTTPS(this: ABURL, value: boolean) {
  this.options.HTTPS = value
}

function useWWW(this: ABURL, value: boolean) {
  this.options.www = value
}

function setPort(this: ABURL, value: number | undefined) {
  this.options.port = value
}

function setAuth(
  this: ABURL,
  value: { username: string; password: string } | undefined
) {
  this.options.auth = value
}

function setSubDomains(this: ABURL, value: string[] | undefined) {
  this.options.subDomains = value
}

function setFragment(this: ABURL, value: string | undefined) {
  this.options.fragment = value
}
