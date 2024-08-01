import { expect, test } from 'bun:test'
import { parseURL } from '../src/parser'
import aBURL from '../src'

test('Parse correctly parses URLs', () => {
  const testData1 =
    'https://janniskaranikis.dev/api/v1/testing?firstName=John&lastName=Doe&age=25'
  const testData2 = 'https://janniskaranikis.dev/'
  const testData3 =
    'http://www.subDomain.anotherSubDomain.janniskaranikis.dev/test#fragment'
  const testData4 =
    'http://www.subDomain.janniskaranikis.dev:40/api/v1/testing?firstName=John&lastName=Doe&age=25#testing'

  const testResult1 = parseURL(testData1)
  const testResult2 = parseURL(testData2)
  const testResult3 = parseURL(testData3)
  const testResult4 = parseURL(testData4)

  const expectedResult1 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: '25' },
  })
  const expectedResult2 = aBURL('janniskaranikis.dev')
  const expectedResult3 = aBURL('janniskaranikis.dev', {
    directories: ['test'],
    www: true,
    fragment: 'fragment',
    HTTPS: false,
    subDomains: ['subDomain', 'anotherSubDomain'],
  })
  const expectedResult4 = aBURL('janniskaranikis.dev', {
    directories: ['api', 'v1', 'testing'],
    params: { firstName: 'John', lastName: 'Doe', age: '25' },
    www: true,
    HTTPS: false,
    fragment: 'testing',
    subDomains: ['subDomain'],
    port: 40,
  })

  expect(testResult1).toEqual(expectedResult1)
  expect(testResult1.url()).toEqual(testData1)
  expect(testResult2).toEqual(expectedResult2)
  expect(testResult2.url()).toEqual(testData2)
  expect(testResult3).toEqual(expectedResult3)
  expect(testResult3.url()).toEqual(testData3)
  expect(testResult4).toEqual(expectedResult4)
  expect(testResult4.url()).toEqual(testData4)
})
