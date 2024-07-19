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

## Usage

```javascript
import aBURL from 'a-better-url'

const directories = ['api', 'v1', 'users']
const params = { id: 1, limit: 100, offset: 0 }

const exampleDotCom = aBURL('example.com', {
  directories: directories,
  params: params,
})

// Fetches from https://example.com/api/v1/users?id=1&limit=100&offset=0
const user1 = await fetch(exampleDotCom.url())

exampleDotCom.removeParams(['id'])
exampleDotCom.updateParams({ firstName: 'John', lastName: 'Doe' })

// Fetches from https://example.com/api/v1/users?limit=100&offset=0&firstName=John&lastName=Doe
const user2 = await fetch(exampleDotCom.url())
```

## Features

- Less messy URL management compared to string concatenation
- Easily add, remove, and update URL parameters
- 0 Dependencies
- TypeScript Support

## API

Coming Soon
