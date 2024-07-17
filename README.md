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

const exampleDotCom = aBURL('example.com', ['api', 'v1', 'users'], { id: 1 })

// Fetches from https://example.com/api/v1/users?id=1
const user1 = await fetch(exampleDotCom.url())

exampleDotCom.removeParams(['id'])
exampleDotCom.updateParams({ firstName: 'John', lastName: 'Doe' })

// Fetches from https://example.com/api/v1/users?firstName=John&lastName=Doe
const user2 = await fetch(exampleDotCom.url())
```

## Features

- Less messy URL management compared to string concatenation
- Easily add, remove, and update URL parameters
- 0 Dependencies
- TypeScript Support

## API

Coming Soon
