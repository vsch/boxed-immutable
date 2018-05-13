"use strict";

const jestEach = require('jest-each');
const boxedImmutable = require("boxed-immutable");
const utilTypeFuncs = require('util-type-funcs');
const objEachBreak = require('obj-each-break');
const testUtil = require('./testUtil');
const _$ = boxedImmutable._$;
const boxOut = boxedImmutable.boxOut;
const $_ = boxedImmutable.boxOut;
const boxState = boxedImmutable.boxState;

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

const isBoxedProxy = boxedImmutable.boxed.isBoxedProxy;
const isBoxedInProxy = boxedImmutable.boxed.isBoxedInProxy;
const isBoxedOutProxy = boxedImmutable.boxed.isBoxedOutProxy;
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

describe('$_array tests', () => {
    let origVal;
    let boxedVal;
    let boxedProxy;
    let vals;

    jestEach([
        ['undefined',undefined,[]],
        ['null',null,[]],
        ['""',"",[""]],
        ['0',0,[0]],
        ['5',5,[5]],
        ['[1,2,3]',[1,2,3],[1,2,3]],
    ])
        .describe("_$(%s).$_array", (text,value,expected) => {

            beforeEach(() => {
                vals = createBoxed(value);
                origVal = vals.origVal;
                boxedVal = vals.boxedVal;
                boxedProxy = vals.boxedProxy;
            });

            test(`_$(${text}).$_array isBoxedInProxy`, () => {
                let pathVal = boxedProxy.$_array;
                expect(!!isBoxedOutProxy(pathVal)).toBe(true);
            });

            test(`_$(${text}).$_array === ${JSON.stringify(value)}`, () => {
                let pathVal = boxedProxy.$_array;
                expect(pathVal).toEqual(expected);
            });

            test(`_$(${text}).$_array.join(',') === ${expected.join(',')}`, () => {
                let pathVal = boxedProxy.$_array;
                expect(pathVal.join(',')).toEqual(expected.join(','));
            });
        });
});
