export type BURL = {
  base: string
  directories: string[]
  params: Record<string, string>
  url(): string
  overrideParams(params: Record<string, string>): void
  options: Options
}

type Options = {
  encodeParams: boolean
}

const defaultOptions: Options = {
  encodeParams: false,
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
    overrideParams: overrideParams,
    options: finalizedOptions,
  }
}

function url(this: BURL) {
  return `${this.base}/${this.directories.join('/')}${Object.keys(this.params).length !== 0 ? '?' : ''}${Object.entries(
    this.params
  )
    .map(
      ([k, v]) =>
        `${k}=${this.options.encodeParams ? encodeURIComponent(v) : v}`
    )
    .join('&')}`
}

function overrideParams(this: BURL, params: Record<string, string>) {
  const newParams = { ...this.params, ...params }
  this.params = newParams
}
