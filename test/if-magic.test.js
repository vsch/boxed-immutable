"use strict";

const jestEach = require('jest-each');
const boxedImmutable = require("boxed-immutable");
const boxOut = require("boxed-out");
const utilTypeFuncs = require('util-type-funcs');
const objEachBreak = require('obj-each-break');
const testUtil = require('./testUtil');

const _$ = boxedImmutable.box;
const $_ = boxOut;

const isObjectLike = utilTypeFuncs.isObjectLike;
const isNullOrUndefined = utilTypeFuncs.isNullOrUndefined;
const isArray = utilTypeFuncs.isArray;
const toArrayIndex = utilTypeFuncs.toArrayIndex;
const isArrayIndex = utilTypeFuncs.isArrayIndex;
const isValid = utilTypeFuncs.isValid;
const isFunction = utilTypeFuncs.isFunction;
const isString = utilTypeFuncs.isString;
const isNumeric = utilTypeFuncs.isNumeric;
const toNumber = utilTypeFuncs.toNumber;

const BREAK = objEachBreak.BREAK;
const cloneArrayObject = objEachBreak.cloneArrayObject;
const hasOwnProperties = objEachBreak.hasOwnProperties;

const isBoxedProxy = boxedImmutable.isBoxedProxy;
const isBoxedInProxy = boxedImmutable.isBoxedInProxy;
const isBoxedOutProxy = boxedImmutable.isBoxedOutProxy;
const createTransformedBoxed = testUtil.createTransformedBoxed;
const generateTestParams = testUtil.generateTestParams;
const paramStringException = testUtil.paramStringException;
const createBoxed = testUtil.createBoxed;
const createOnDemandBoxed = testUtil.createBoxedState;
const toTypeString = testUtil.toTypeString;
const stringify = testUtil.stringify;
const createBoxedState = testUtil.createBoxedState;
const array = testUtil.array;
const object = testUtil.object;

test(`_$(['a','b','c']).$_ifValid(value => value.join(', ')) returns "a, b, c"`, () => {
    let result = _$(['a', 'b', 'c']).$_ifValid(value => value.join(', '));
    expect(result).toEqual("a, b, c");
});

test(`_$(['a','b','c']).$_ifValid(Array.prototype.join(', ')) returns "a, b, c"`, () => {
    let result = _$(['a', 'b', 'c']).$_ifValid(Array.prototype.join, ', ');
    expect(result).toEqual("a, b, c");
});

test(`_$(['a','b','c']).$_ifValid(Array.prototype.join(', ')) returns "a, b, c"`, () => {
    let result = _$(['a', 'b', 'c']).$_ifValid(Array.prototype.join, undefined);
    expect(result).toEqual("a,b,c");
});

// TEST: complete this test
describe.skip('.$_forEachKey(value)', () => {
    test('', () => {

    });
});

describe.skip('.forEachKey_$(value)', () => {
    test('', () => {

    });
});

