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

export function aBURL(
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
