"use strict";

const each = require('jest-each');
const boxedImmutable = require("boxed-immutable");
const testUtil = require('./testUtil');
const util = boxedImmutable.util;
const _$ = boxedImmutable._$;

const isObject = util.isObject;
const isBoxedProxy = boxedImmutable.boxed.isBoxedProxy;
const isBoxedInProxy = boxedImmutable.boxed.isBoxedInProxy;
const isBoxedOutProxy = boxedImmutable.boxed.isBoxedOutProxy;
const generateTestParams = testUtil.generateTestParams;
const paramStringException = testUtil.paramStringException;
const createBoxed = testUtil.createBoxed;
const createOnDemandBoxed = testUtil.createBoxedState;
const isNullOrUndefined = boxedImmutable.util.isNullOrUndefined;
const toTypeString = testUtil.toTypeString;
const createBoxedState = testUtil.createBoxedState;

function booleanTransform(value) {
    return !!value;
}

function inSetTransform(value, setOf, defaultValue) {
    return setOf.indexOf(value) === -1 ? defaultValue !== undefined ? defaultValue : setOf[0] : value;
}

function valueTypeTransform(value, setOfTypes, defaultValue) {
    return setOfTypes.indexOf(typeof value) === -1 ? defaultValue : value;
}

describe('inSetTransform', () => {
    each([
        ['in set', { value: 'c', setOf: ['a', 'b', 'c', 0,], defaultValue: undefined, expected: 'c' }],
        ['number not string', { value: '0', setOf: ['a', 'b', 'c', 0,], defaultValue: undefined, expected: 'a' }],
        ['default provided', { value: '0', setOf: ['a', 'b', 'c', 0,], defaultValue: null, expected: null }],
    ])
        .describe('%s', (testDescription, t) => {
            test(`inSetTransform(${toTypeString(t.value)}) === ${toTypeString(t.expected)}`, () => {
                expect(inSetTransform(t.value, t.setOf, t.defaultValue)).toEqual(t.expected);
            });
        });
});

describe('inSetTransform(toNumber())', () => {
    each([
        ['in set', { value: 'c', setOf: ['a', 'b', 'c', 0,], defaultValue: undefined, expected: 'c' }],
        ['number not string', { value: '0', setOf: ['a', 'b', 'c', 0,], defaultValue: undefined, expected: 0 }],
        ['default provided', { value: '0', setOf: ['a', 'b', 'c', 0,], defaultValue: null, expected: 0 }],
    ])
        .describe('%s', (testDescription, t) => {
            let origVal;
            let boxedVal;
            let boxedProxy;
            let vals;

            // beforeEach(() => {
            //     vals = createBoxed(thisTest.value);
            //     origVal = vals.origVal;
            //     boxedVal = vals.boxedVal;
            //     boxedProxy = vals.boxedProxy;
            // });

            test(`inSetTransform(toNumber(${toTypeString(t.value)})) === ${toTypeString(t.expected)}`, () => {
                expect(inSetTransform(util.toNumber(t.value), t.setOf, t.defaultValue)).toEqual(t.expected);
            });
        });
});

describe('valueTypeTransform()', () => {
    each([
        ['in set', { value: 'c', setOf: ['string', 'number'], defaultValue: undefined, expected: 'c' }],
        ['number not string', { value: '0', setOf: ['string', 'number'], defaultValue: undefined, expected: '0' }],
        ['default provided', { value: '0', setOf: ['string', 'number'], defaultValue: null, expected: '0' }],
        ['number not string', { value: true, setOf: ['string', 'number'], defaultValue: undefined, expected: undefined }],
        ['default provided', { value: false, setOf: ['string', 'number'], defaultValue: null, expected: null }],
    ])
        .describe('%s', (testDescription, t) => {
            let origVal;
            let boxedVal;
            let boxedProxy;
            let vals;

            // beforeEach(() => {
            //     vals = createBoxed(thisTest.value);
            //     origVal = vals.origVal;
            //     boxedVal = vals.boxedVal;
            //     boxedProxy = vals.boxedProxy;
            // });

            test(`valueTypeTransform(toNumber(${toTypeString(t.value)})) === ${toTypeString(t.expected)}`, () => {
                expect(valueTypeTransform(t.value, t.setOf, t.defaultValue)).toEqual(t.expected);
            });
        });
});

function capitalize(value) {
    return util.isString(value) ? value.toUpperCase() : value;
}

function toArrayIndex(arg) {
    const n = Number.parseFloat(arg);
    return Number.isInteger(n) && +n === n && n >= 0 ? n : undefined;
}

function toNumberOrUndefined(arg) {
    const n = Number.parseFloat(arg);
    // noinspection EqualityComparisonWithCoercionJS
    return n == arg ? n : undefined;
}

function totalTransform(value, prop, oldValue, getProp, setProp) {
    // total all the values
    prop = toArrayIndex(prop);
    if (prop !== undefined) {
        const oldTotal = toNumberOrUndefined(getProp('total'));
        const oldIndices = getProp('totaled');
        const indices = oldIndices || [];

        let total = oldTotal || 0;

        let indexOf = -1;
        if (oldTotal !== undefined) {
            indexOf = indices.indexOf(prop);
            if (indexOf !== -1) {
                oldValue = toNumberOrUndefined(oldValue);
                if (oldValue !== undefined) {
                    total -= oldValue;
                }
            }
        }

        const newValue = toNumberOrUndefined(value);
        if (newValue !== undefined) {
            total += newValue;
            if (indexOf === -1) indices.push(prop);
        }

        if (oldTotal !== total) {
            setProp('total', total);
        }
        if (indices !== oldIndices) {
            setProp('totaled', indices);
        }
    }
    return value;
}

function roundTransform(value) {
    return Math.round(value);
}

const setTransforms = {
    capitalized: capitalize,
    boolean: booleanTransform,
    nested: {
        capitalized: capitalize,
        boolean: booleanTransform,
        nested: {
            capitalized: capitalize,
            boolean: booleanTransform,
        },
    },
    booleanArr: {
        '': booleanTransform,
    },
    withTotals: {
        '': totalTransform,
    },
    withRounded: {
        '': roundTransform,
    },
    withRoundedTotals: {
        '': [roundTransform, totalTransform],
    },
};

const original = {
    capitalized: 'lowercase',
    boolean: {},
    another: 'someValue',
    nested: {
        capitalized: 5,
        boolean: 0,
        another: 'someValue',
        nested: {
            capitalized: null,
            boolean: NaN,
            another: 'someValue',
        },
    },
    booleanArr: [undefined, null, NaN, 0, true, '0', 'abc', 'def', 10],
    anotherArr: [1, 2, 3, 4],
};

const applied = {
    capitalized: 'LOWERCASE',
    boolean: true,
    another: 'someValue',
    nested: {
        capitalized: 5,
        boolean: false,
        another: 'someValue',
        nested: {
            capitalized: null,
            boolean: false,
            another: 'someValue',
        },
    },
    booleanArr: [false, false, false, false, true, true, true, true, true],
    anotherArr: [1, 2, 3, 4],
};

describe('setTransforms applied to props', () => {
    let origVal;
    let boxedVal;
    let boxedProxy;
    let vals;

    let box;

    beforeAll(() => {
        box = boxedImmutable.createBox({ setTransforms: setTransforms });
    });

    test(`setTransforms applied to value`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        boxedVal.setValueOf(original);

        expect(boxedVal.value).toEqual(applied);
    });

    test(`setTransforms set modified`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        boxedVal.setValueOf(original);

        expect(boxedVal.valueOfModified()).toEqual(applied);
    });

    test(`setTransforms delete cancelled`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        boxedVal.setValueOf(original);

        let oldValue = boxedProxy.boolean();
        expect(oldValue).toEqual(oldValue === true);
        
        delete boxedProxy.boolean;
        let value = boxedProxy.boolean();
        
        expect(value).toBe(false);
    });

    test(`with totals`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        const withTotals = [1, 2, 3, 4];
        boxedProxy.withTotals = withTotals;

        withTotals.total = withTotals.reduce((prev, value) => (prev || 0) + value);

        // expect(boxedVal.value.withTotals.total).toEqual(withTotals.total);
        expect(testUtil.arrayToObject(boxedVal.valueOfModified().withTotals, ['totaled'])).toEqual(testUtil.arrayToObject(withTotals));
    });

    test(`with totals mods`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        const withTotals = [1.5, 2.5, 3.5, 4.5];
        boxedProxy.withTotals = withTotals;

        boxedProxy.withTotals[''] = 10.5;
        withTotals.push(10.5);

        withTotals.total = withTotals.reduce((prev, value) => (prev || 0) + value);

        // expect(boxedVal.value.withTotals.total).toEqual(withTotals.total);
        expect(testUtil.arrayToObject(boxedVal.valueOfModified().withTotals, ['totaled'])).toEqual(testUtil.arrayToObject(withTotals));
    });

    test(`with totals delete`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        const withTotals = [1.5, 2.5, 3.5, 4.5];
        boxedProxy.withTotals = withTotals;

        delete boxedProxy.withTotals[2];
        delete withTotals[2];

        withTotals.total = withTotals.reduce((prev, value) => (prev || 0) + value);

        // expect(boxedVal.value.withTotals.total).toEqual(withTotals.total);
        expect(testUtil.arrayToObject(boxedVal.valueOfModified().withTotals, ['totaled'])).toEqual(testUtil.arrayToObject(withTotals));
    });

    test(`with rounded mods`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        let withTotals = [1.5, 2.5, 3.5, 4.5];
        boxedProxy.withRounded = withTotals;

        boxedProxy.withRounded[''] = 10.5;
        withTotals.push(10.5);

        withTotals = withTotals.map(roundTransform);
        // withTotals.total = withTotals.reduce((prev, value, index) => (prev || 0) + value);

        // expect(boxedVal.value.withTotals.total).toEqual(withTotals.total);
        expect(testUtil.arrayToObject(boxedVal.valueOfModified().withRounded, ['totaled'])).toEqual(testUtil.arrayToObject(withTotals));
    });

    test(`with rounded totals mods`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        let withTotals = [1.5, 2.5, 3.5, 4.5];
        boxedProxy.withRoundedTotals = withTotals;

        boxedProxy.withRoundedTotals[''] = 10.5;
        withTotals.push(10.5);

        withTotals = withTotals.map(roundTransform);
        withTotals.total = withTotals.reduce((prev, value, index) => (prev || 0) + value);

        // expect(boxedVal.value.withTotals.total).toEqual(withTotals.total);
        expect(testUtil.arrayToObject(boxedVal.valueOfModified().withRoundedTotals, ['totaled'])).toEqual(testUtil.arrayToObject(withTotals));
    });
    
    test(`with object totals`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        const withTotals = [1, 2, 3, 4];
        boxedProxy.withTotals = util.copyArrayObject(withTotals);

        withTotals.total = withTotals.reduce((prev, value) => (prev || 0) + value);

        // expect(boxedVal.value.withTotals.total).toEqual(withTotals.total);
        expect(testUtil.arrayToObject(boxedVal.valueOfModified().withTotals, ['totaled'])).toEqual(testUtil.arrayToObject(withTotals));
    });

    test(`with object totals mods`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        const withTotals = [1.5, 2.5, 3.5, 4.5];
        boxedProxy.withTotals = util.copyArrayObject(withTotals);

        boxedProxy.withTotals[''] = 10.5;
        withTotals.push(10.5);

        withTotals.total = withTotals.reduce((prev, value) => (prev || 0) + value);

        // expect(boxedVal.value.withTotals.total).toEqual(withTotals.total);
        expect(testUtil.arrayToObject(boxedVal.valueOfModified().withTotals, ['totaled'])).toEqual(testUtil.arrayToObject(withTotals));
    });

    test(`with object totals delete`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        const withTotals = [1.5, 2.5, 3.5, 4.5];
        boxedProxy.withTotals = util.copyArrayObject(withTotals);

        delete boxedProxy.withTotals[2];
        delete withTotals[2];

        withTotals.total = withTotals.reduce((prev, value) => (prev || 0) + value);

        // expect(boxedVal.value.withTotals.total).toEqual(withTotals.total);
        expect(testUtil.arrayToObject(boxedVal.valueOfModified().withTotals, ['totaled'])).toEqual(testUtil.arrayToObject(withTotals));
    });

    test(`with object rounded mods`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        let withTotals = [1.5, 2.5, 3.5, 4.5];
        boxedProxy.withRounded = util.copyArrayObject(withTotals);

        boxedProxy.withRounded[''] = 10.5;
        withTotals.push(10.5);

        withTotals = withTotals.map(roundTransform);
        // withTotals.total = withTotals.reduce((prev, value, index) => (prev || 0) + value);

        // expect(boxedVal.value.withTotals.total).toEqual(withTotals.total);
        expect(testUtil.arrayToObject(boxedVal.valueOfModified().withRounded, ['totaled'])).toEqual(testUtil.arrayToObject(withTotals));
    });

    test(`with object rounded totals mods`, () => {
        const vals = createBoxed({}, box);
        const { origVal, boxedVal, boxedProxy } = vals;
        let withTotals = [1.5, 2.5, 3.5, 4.5];
        boxedProxy.withRoundedTotals = util.copyArrayObject(withTotals);

        boxedProxy.withRoundedTotals[''] = 10.5;
        withTotals.push(10.5);

        withTotals = withTotals.map(roundTransform);
        withTotals.total = withTotals.reduce((prev, value, index) => (prev || 0) + value);

        // expect(boxedVal.value.withTotals.total).toEqual(withTotals.total);
        expect(testUtil.arrayToObject(boxedVal.valueOfModified().withRoundedTotals, ['totaled'])).toEqual(testUtil.arrayToObject(withTotals));
    });
});

