export type BURL = {
  base: string
  directories: string[]
  params: Record<string, string>
  url(): string
  overrideParams(params: Record<string, string>): void
  getDirectories(): string[]
  getDirectoriesFlat(): string
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

export function bURL(
  base: string,
  directories: string[] = [],
  params: Record<string, string> = {},
  options?: Options
): BURL {
  const finalizedOptions = mergeOptions(options)
  return {
    base,
    directories,
    params,
    url: url,
    overrideParams: updateParams,
    getDirectories: getDirectories,
    getDirectoriesFlat: getDirectoriesFlat,
    options: finalizedOptions,
  }
}

function url(this: BURL) {
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

function updateParams(this: BURL, params: Record<string, string>) {
  const newParams = { ...this.params, ...params }
  this.params = newParams
}

function getDirectories(this: BURL) {
  return this.directories
}

function
