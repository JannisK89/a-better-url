import { expect, test } from 'bun:test'
import { bURL } from '../src'

test('url builds correct URLs', () => {
  const test1 = bURL('janniskaranikis.dev', ['api', 'v1', 'testing'], {
    firstName: 'John',
    lastName: 'Doe',
    age: '25',
  })
  const test2 = bURL('janniskaranikis.dev')
  const test3 = bURL('janniskaranikis.dev', void 0, { testing: 'true' })
  const test4 = bURL('janniskaranikis.dev', ['testing'])

  expect(test1.url()).toBe(
    'https://janniskaranikis.dev/api/v1/testing?firstName=John&lastName=Doe&age=25'
  )
  expect(test2.url()).toBe('https://janniskaranikis.dev/')
  expect(test3.url()).toBe('https://janniskaranikis.dev/?testing=true')
  expect(test4.url()).toBe('https://janniskaranikis.dev/testing')
})

test('updateParams correctly updates paramteters', () => {
  const test1 = bURL('janniskaranikis.dev', ['api', 'v1', 'testing'], {
    firstName: 'John',
    lastName: 'Doe',
    age: '25',
  })
  const test2 = bURL(
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
  const test1 = bURL('janniskaranikis.dev', void 0, void 0, { HTTPS: false })
  const test2 = bURL('janniskaranikis.dev', void 0, void 0, { HTTPS: true })
  const test3 = bURL('janniskaranikis.dev')

  expect(test1.url()).toBe('http://janniskaranikis.dev/')
  expect(test2.url()).toBe('https://janniskaranikis.dev/')
  expect(test3.url()).toBe('https://janniskaranikis.dev/')
})
