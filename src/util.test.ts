import 'jest';
import { getHeapStatistics } from 'v8';

import { wait, regexFromString } from './util';

// mocks the setTimeout function, see https://jestjs.io/docs/timer-mocks
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

function testRegexLiteral(r1: RegExp) {
  const r2 = regexFromString(String(r1));
  expect(r1.source).toStrictEqual(r2.source);
  expect(r1.flags).toStrictEqual(r2.flags);
}

function testRegexBody(s: string) {
  const r1 = RegExp(s);
  const r2 = regexFromString(s);
  expect(r1.source).toStrictEqual(r2.source);
  expect(r1.flags).toStrictEqual(r2.flags);
}

describe('util', () => {
  test('wait', async () => {
    const waitTime = 1000;
    wait(waitTime);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), waitTime);
  });

  test('regexFromString', () => {
    testRegexLiteral(/hello\s{0,1}[-_.]{0,1}world|ls\b/gim);
    testRegexBody('hello\\s{0,1}[-_.]{0,1}world|ls\\b');
    testRegexLiteral(/^[A-Za-z]+$/);
    testRegexBody('^[A-Za-z]+$');
    testRegexLiteral(/foo\/bar/gi);
    testRegexBody('foo\\/bar');
  });
});
