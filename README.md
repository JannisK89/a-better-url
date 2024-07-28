# aBURL - A Better URL

A simpler way to manage URLs in your project without the mess of string concatenation.

## Installation

### Npm

```bash
npm install a-better-url
```

### Bun

```bash
bun install a-better-url
```

## Features

- Less messy URL management compared to string concatenation
- Easily add, remove, and update URL parameters
- 0 Dependencies
- TypeScript Support

## Usage

```javascript
import aBURL from 'a-better-url'

const options = {
  directories: ['api', 'v1', 'users'],
  params: { id: 1, limit: 100, offset: 0 },
  subDomains: ['shop'],
}

const exampleDotCom = aBURL('example.com', {
  ...options,
})

// Fetches from https://shop.example.com/api/v1/users?id=1&limit=100&offset=0
const user1 = await fetch(exampleDotCom.url())

exampleDotCom.removeParams(['id'])
exampleDotCom.updateParams({ firstName: 'John', lastName: 'Doe' })

// Fetches from https://shop.example.com/api/v1/users?limit=100&offset=0&firstName=John&lastName=Doe
const user2 = await fetch(exampleDotCom.url())
```

## API

### aBURL(host: string, options: Options): ABURL

Creates a new instance of `ABURL` with the given host and options.

#### Host

The base URL.
Example: `example.com`

#### Options

Options is an object that can contain the following properties:

```typescript
type Options = {
  directories?: string[]
  params?: Record<string, string | number>
  encodeParams?: boolean
  HTTPS?: boolean
  www?: boolean
  port?: number
  auth?: {
    username: string
    password: string
  }
  subDomains?: string[]
  fragment?: string
}
```

- `directories` - An array of strings that represent the directories in the URL. Default is `[]`.
- `params` - An object that contains key-value pairs that represent the URL parameters. Default is `{}`.
- `encodeParams` - A boolean that determines if the URL parameters should be encoded. Default is `true`.
- `HTTPS` - A boolean that determines if the URL should use HTTPS. Default is `true`.
- `www` - A boolean that determines if the URL should use `www`. Default is `false`.
- `port` - A number that represents the port number. Default is `undefined` which means no port is added.
- `auth` - An object that contains the username and password for basic authentication. Default is `undefined` which means no authentication is added.
- `subDomains` - An array of strings that represent the subdomains in the URL. Default is `[]`.
- `fragment` - A string that represents the fragment in the URL. Default is `undefined` which means no fragment is added.

### ABURL

Object that represents a URL.

```typescript
type ABURL = {
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
  useHTTPS(value: boolean): void
  useWWW(value: boolean): void
  setPort(port: number | undefined): void
  setAuth(value: { username: string; password: string } | undefined): void
  setSubDomains(subDomains: string[] | undefined): void
  setFragment(fragment: string | undefined): void
  options: Options
}
```

- `base` - The base URL.
- `url()` - Returns the full URL as a string.
- `updateParams(params: Record<string, string | number>)` - Updates the URL parameters.
- `toUpdatedParams(params: Record<string, string | number>)` - Returns a new instance of `ABURL` with updated URL parameters.
- `removeParams(params: string[])` - Removes the URL parameters.
- `toRemovedParams(params: string[])` - Returns a new instance of `ABURL` with removed URL parameters.
- `getDirectories()` - Returns an array of strings that represent the directories in the URL.
- `getDirectoriesFlat()` - Returns a string that represents the directories in the URL.
- `getParams()` - Returns an object that contains key-value pairs that represent the URL parameters.
- `getParamsFlat()` - Returns a string that represents the URL parameters.
- `useHTTPS(value: boolean)` - Sets the URL to use HTTPS or HTTP.
- `useWWW(value: boolean)` - Sets the URL to use `www` or not.
- `setPort(port: number | undefined)` - Sets the port number.
- `setAuth(value: { username: string; password: string } | undefined)` - Sets the basic authentication.
- `setSubDomains(subDomains: string[] | undefined)` - Sets the subdomains.
- `setFragment(fragment: string | undefined)` - Sets the fragment.
- `options` - The options object that was used to create the instance of `ABURL`.
