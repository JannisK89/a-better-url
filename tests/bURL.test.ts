import { expect, test } from 'bun:test'
import { aBURL } from '../src'

test('url builds correct URLs', () => {
  const test1 = aBURL('janniskaranikis.dev', ['api', 'v1', 'testing'], {
    firstName: 'John',
    lastName: 'Doe',
    age: '25',
  })
  const test2 = aBURL('janniskaranikis.dev')
  const test3 = aBURL('janniskaranikis.dev', void 0, { testing: 'true' })
  const test4 = aBURL('janniskaranikis.dev', ['testing'])

  expect(test1.url()).toBe(
    'https://janniskaranikis.dev/api/v1/testing?firstName=John&lastName=Doe&age=25'
  )
  expect(test2.url()).toBe('https://janniskaranikis.dev/')
  expect(test3.url()).toBe('https://janniskaranikis.dev/?testing=true')
  expect(test4.url()).toBe('https://janniskaranikis.dev/testing')
})

test('updateParams correctly updates paramteters', () => {
  const test1 = aBURL('janniskaranikis.dev', ['api', 'v1', 'testing'], {
    firstName: 'John',
    lastName: 'Doe',
    age: '25',
  })
  const test2 = aBURL(
    'janniskaranikis.dev',
    ['api', 'v1', 'something'],
    {
      firstName: 'Jane',
      lastName: 'Doe',
      age: '21',
    },
    { encodeParams: true }
  )

  test1.overrideParams({ firstName: 'Jane', age: '30' })
  test2.overrideParams({ firstName: 'Jöäå', lastName: 'Dåäö', age: '20' })

  expect(test1.url()).toBe(
    'https://janniskaranikis.dev/api/v1/testing?firstName=Jane&lastName=Doe&age=30'
  )
  expect(test2.url()).toBe(
    'https://janniskaranikis.dev/api/v1/something?firstName=J%C3%B6%C3%A4%C3%A5&lastName=D%C3%A5%C3%A4%C3%B6&age=20'
  )
})

test('Options tests', () => {
  const httpsTest1 = aBURL('janniskaranikis.dev', void 0, void 0, {
    HTTPS: false,
  })
  const httpsTest2 = aBURL('janniskaranikis.dev', void 0, void 0, {
    HTTPS: true,
  })
  const httpsTest3 = aBURL('janniskaranikis.dev')
  const wwwTest1 = aBURL('janniskaranikis.dev', void 0, void 0, {
    www: true,
  })
  const wwwTest2 = aBURL('janniskaranikis.dev', void 0, void 0, {
    www: false,
  })

  expect(httpsTest1.url()).toBe('http://janniskaranikis.dev/')
  expect(httpsTest2.url()).toBe('https://janniskaranikis.dev/')
  expect(httpsTest3.url()).toBe('https://janniskaranikis.dev/')
  expect(wwwTest1.url()).toBe('https://www.janniskaranikis.dev/')
  expect(wwwTest2.url()).toBe('https://janniskaranikis.dev/')
})

test('getDirectories and getDirectoriesFlat tests', () => {
  const test1 = aBURL('janniskaranikis.dev', ['api', 'v1', 'testing'], {
    firstName: 'John',
    lastName: 'Doe',
    age: '25',
  })
  const test2 = aBURL('janniskaranikis.dev', ['api', 'v2', 'testing'])

  expect(test1.getDirectories()).toEqual(['api', 'v1', 'testing'])
  expect(test2.getDirectories()).toEqual(['api', 'v2', 'testing'])
  expect(test1.getDirectoriesFlat()).toBe('api/v1/testing')
  expect(test2.getDirectoriesFlat()).toBe('api/v2/testing')
})

test('getParams and getParamsFlat tests', () => {
  const test1 = aBURL('janniskaranikis.dev', ['api', 'v1', 'testing'], {
    firstName: 'John',
    lastName: 'Doe',
    age: '25',
  })
  const test2 = aBURL('janniskaranikis.dev', ['api', 'v2', 'testing'])

  expect(test1.getParams()).toEqual({
    firstName: 'John',
    lastName: 'Doe',
    age: '25',
  })
  expect(test2.getParams()).toEqual({})
  expect(test1.getParamsFlat()).toBe('firstName=John&lastName=Doe&age=25')
  expect(test2.getParamsFlat()).toBe('')
})
