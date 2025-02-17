import { expect, test } from 'bun:test'
import aBURL from '../src'

test('url builds correct URLs', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: 25 },
  })
  const test2 = aBURL('janniskaranikis.dev')
  const test3 = aBURL('janniskaranikis.dev', { params: { testing: 'true' } })
  const test4 = aBURL('janniskaranikis.dev', { directories: ['testing'] })

  expect(test1.url()).toBe(
    'https://janniskaranikis.dev/api/v1/testing?firstName=John&lastName=Doe&age=25'
  )
  expect(test2.url()).toBe('https://janniskaranikis.dev/')
  expect(test3.url()).toBe('https://janniskaranikis.dev/?testing=true')
  expect(test4.url()).toBe('https://janniskaranikis.dev/testing')
})

test('updateParams correctly updates paramteters', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: 25 },
  })
  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'something'],
    params: { firstName: 'Jane', lastName: 'Doe', age: 25 },
    encodeParams: true,
  })

  test1.updateParams({ firstName: 'Jane', age: 30 })
  test2.updateParams({ firstName: 'Jöäå', lastName: 'Dåäö', age: 20 })

  expect(test1.url()).toBe(
    'https://janniskaranikis.dev/api/v1/testing?firstName=Jane&lastName=Doe&age=30'
  )
  expect(test2.url()).toBe(
    'https://janniskaranikis.dev/api/v1/something?firstName=J%C3%B6%C3%A4%C3%A5&lastName=D%C3%A5%C3%A4%C3%B6&age=20'
  )
})

test('ToUpdateParams returns new ABURL object with updated params', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: 25 },
  })
  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'something'],
    params: { firstName: 'Jane', lastName: 'Doe', age: 25 },
    encodeParams: true,
  })

  const test1New = test1.toUpdatedParams({ firstName: 'Jane', age: 30 })
  const test2New = test2.toUpdatedParams({
    firstName: 'Jöäå',
    lastName: 'Dåäö',
    age: 20,
  })

  expect(test1.url()).toBe(
    'https://janniskaranikis.dev/api/v1/testing?firstName=John&lastName=Doe&age=25'
  )
  expect(test1New.url()).toBe(
    'https://janniskaranikis.dev/api/v1/testing?firstName=Jane&lastName=Doe&age=30'
  )
  expect(test2.url()).toBe(
    'https://janniskaranikis.dev/api/v1/something?firstName=Jane&lastName=Doe&age=25'
  )
  expect(test2New.url()).toBe(
    'https://janniskaranikis.dev/api/v1/something?firstName=J%C3%B6%C3%A4%C3%A5&lastName=D%C3%A5%C3%A4%C3%B6&age=20'
  )
})

test('removeParams correctly removes paramteters', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: '25' },
  })
  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'something'],
    params: { firstName: 'Jane', lastName: 'Doe', age: '25' },
  })
  const test3 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'users'],
    params: { firstName: 'Romeo', lastName: 'Juliet', age: '41' },
  })

  test1.removeParams(['firstName', 'age'])
  test2.removeParams(['firstName', 'age', 'lastName'])
  test3.removeParams(['FirstName', 'age', 'LastName'])

  expect(test1.url()).toBe(
    'https://janniskaranikis.dev/api/v1/testing?lastName=Doe'
  )
  expect(test2.url()).toBe('https://janniskaranikis.dev/api/v1/something')
  expect(test3.url()).toBe(
    'https://janniskaranikis.dev/api/v1/users?firstName=Romeo&lastName=Juliet'
  )
})

test('toRemovedParams returns a new ABURL object with the params removed', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: 25 },
  })
  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'something'],
    params: { firstName: 'Jane', lastName: 'Doe', age: '25' },
  })
  const test3 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'users'],
    params: { firstName: 'Romeo', lastName: 'Juliet', age: '41' },
  })

  const test1New = test1.toRemovedParams(['firstName', 'age'])
  const test2New = test2.toRemovedParams(['firstName', 'age', 'lastName'])
  const test3New = test3.toRemovedParams(['FirstName', 'age', 'LastName'])

  expect(test1.url()).toBe(
    'https://janniskaranikis.dev/api/v1/testing?firstName=John&lastName=Doe&age=25'
  )
  expect(test1New.url()).toBe(
    'https://janniskaranikis.dev/api/v1/testing?lastName=Doe'
  )
  expect(test2.url()).toBe(
    'https://janniskaranikis.dev/api/v1/something?firstName=Jane&lastName=Doe&age=25'
  )
  expect(test2New.url()).toBe('https://janniskaranikis.dev/api/v1/something')
  expect(test3.url()).toBe(
    'https://janniskaranikis.dev/api/v1/users?firstName=Romeo&lastName=Juliet&age=41'
  )
  expect(test3New.url()).toBe(
    'https://janniskaranikis.dev/api/v1/users?firstName=Romeo&lastName=Juliet'
  )
})

test('Options tests', () => {
  const httpsTest1 = aBURL('janniskaranikis.dev', {
    HTTPS: false,
  })
  const httpsTest2 = aBURL('janniskaranikis.dev', {
    HTTPS: true,
  })
  const httpsTest3 = aBURL('janniskaranikis.dev')
  const wwwTest1 = aBURL('janniskaranikis.dev', {
    www: true,
  })
  const wwwTest2 = aBURL('janniskaranikis.dev', {
    www: false,
  })
  const portTest1 = aBURL('janniskaranikis.dev', { port: 3000 })
  const authTest1 = aBURL('janniskaranikis.dev', {
    auth: { username: 'user', password: 'pass' },
  })
  const subDomainTest1 = aBURL('janniskaranikis.dev', {
    subDomains: ['subDomain'],
  })
  const subDomainTest2 = aBURL('janniskaranikis.dev', {
    subDomains: ['subDomain', 'shop'],
  })
  const fragmentTest1 = aBURL('janniskaranikis.dev', {
    directories: ['about'],
    fragment: 'testing',
  })

  expect(httpsTest1.url()).toBe('http://janniskaranikis.dev/')
  expect(httpsTest2.url()).toBe('https://janniskaranikis.dev/')
  expect(httpsTest3.url()).toBe('https://janniskaranikis.dev/')
  expect(wwwTest1.url()).toBe('https://www.janniskaranikis.dev/')
  expect(wwwTest2.url()).toBe('https://janniskaranikis.dev/')
  expect(portTest1.url()).toBe('https://janniskaranikis.dev:3000/')
  expect(authTest1.url()).toBe('https://user:pass@janniskaranikis.dev/')
  expect(subDomainTest1.url()).toBe('https://subDomain.janniskaranikis.dev/')
  expect(subDomainTest2.url()).toBe(
    'https://subDomain.shop.janniskaranikis.dev/'
  )
  expect(fragmentTest1.url()).toBe('https://janniskaranikis.dev/about#testing')
})

test('getDirectories and getDirectoriesFlat tests', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: '25' },
  })
  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
  })

  expect(test1.getDirectories()).toEqual(['api', 'v1', 'testing'])
  expect(test2.getDirectories()).toEqual(['api', 'v2', 'testing'])
  expect(test1.getDirectoriesFlat()).toBe('api/v1/testing')
  expect(test2.getDirectoriesFlat()).toBe('api/v2/testing')
})

test('getParams and getParamsFlat tests', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: 25 },
  })
  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
  })

  expect(test1.getParams()).toEqual({
    firstName: 'John',
    lastName: 'Doe',
    age: 25,
  })
  expect(test2.getParams()).toEqual({})
  expect(test1.getParamsFlat()).toBe('firstName=John&lastName=Doe&age=25')
  expect(test2.getParamsFlat()).toBe('')
})

test('useHTTPS correctly switches between https and http', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: 25 },
  })
  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
  })

  test1.useHTTPS(false)
  test2.useHTTPS(true)

  expect(test1.url()).toBe(
    'http://janniskaranikis.dev/api/v1/testing?firstName=John&lastName=Doe&age=25'
  )
  expect(test2.url()).toBe('https://janniskaranikis.dev/api/v2/testing')
})

test('useWWW correctly switches between www and empty string', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: 25 },
  })
  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
    www: true,
  })

  test1.useWWW(true)
  test2.useWWW(false)

  expect(test1.url()).toBe(
    'https://www.janniskaranikis.dev/api/v1/testing?firstName=John&lastName=Doe&age=25'
  )
  expect(test2.url()).toBe('https://janniskaranikis.dev/api/v2/testing')
})

test('setPort correctly changes or sets port', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: 25 },
    port: 3000,
  })

  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
  })

  const test3 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
    port: 4000,
  })

  test1.setPort(4000)
  test2.setPort(5000)
  test3.setPort(undefined)

  expect(test1.url()).toBe(
    'https://janniskaranikis.dev:4000/api/v1/testing?firstName=John&lastName=Doe&age=25'
  )
  expect(test2.url()).toBe('https://janniskaranikis.dev:5000/api/v2/testing')
  expect(test3.url()).toBe('https://janniskaranikis.dev/api/v2/testing')
})

test('setAuth changes or sets http auth', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: 25 },
    auth: { username: 'user', password: 'pass' },
  })

  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
  })

  const test3 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
    auth: { username: 'user', password: 'pass' },
  })

  test1.setAuth({ username: 'user2', password: 'pass2' })
  test2.setAuth({ username: 'user', password: 'pass' })
  test3.setAuth(undefined)

  expect(test1.url()).toBe(
    'https://user2:pass2@janniskaranikis.dev/api/v1/testing?firstName=John&lastName=Doe&age=25'
  )
  expect(test2.url()).toBe(
    'https://user:pass@janniskaranikis.dev/api/v2/testing'
  )
  expect(test3.url()).toBe('https://janniskaranikis.dev/api/v2/testing')
})

test('setSubdomains updates or sets subdomains', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: 25 },
    subDomains: ['subDomain'],
  })

  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
  })

  const test3 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
    subDomains: ['subDomain', 'shop'],
  })

  test1.setSubDomains(['shop'])
  test2.setSubDomains(['subDomain'])
  test3.setSubDomains(undefined)

  expect(test1.url()).toBe(
    'https://shop.janniskaranikis.dev/api/v1/testing?firstName=John&lastName=Doe&age=25'
  )
  expect(test2.url()).toBe(
    'https://subDomain.janniskaranikis.dev/api/v2/testing'
  )
  expect(test3.url()).toBe('https://janniskaranikis.dev/api/v2/testing')
})

test('setFragment updates or sets fragment', () => {
  const test1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: 25 },
    fragment: 'testing',
  })

  const test2 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
  })

  const test3 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v2', 'testing'],
    fragment: 'testing',
  })

  test1.setFragment('about')
  test2.setFragment('about')
  test3.setFragment(undefined)

  expect(test1.url()).toBe(
    'https://janniskaranikis.dev/api/v1/testing?firstName=John&lastName=Doe&age=25#about'
  )
  expect(test2.url()).toBe('https://janniskaranikis.dev/api/v2/testing#about')
  expect(test3.url()).toBe('https://janniskaranikis.dev/api/v2/testing')
})
