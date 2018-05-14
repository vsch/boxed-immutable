const boxedImmutable = require('boxed-immutable');

describe(`Wiki Transforms`, () => {
    test(`Properties ending in 'Flag' to boolean`, () => {
        const _$ = require('boxed-immutable').box;

        function endsWith(arg, suffix) {
            return arg.substr(arg.length - suffix.length) === suffix;
        }

        function flagsToBoolean(value, prop, oldValue, getProp, setProp) {
            if (prop !== 'Flag' && endsWith(prop, 'Flag')) {
                return !!value;
            }
            return value;
        }

        let state = {
            numFlag: 0,
            nullFlag: null,
            stringFlag: 'yes',
            arrFlag: [],
            objFlag: {},
        };

        const allFlagsToBoolean = {
            '_$': flagsToBoolean,
        };

        const transforms = {
            getTransforms: allFlagsToBoolean,  // only applied when boxed proxy is created
            setTransforms: allFlagsToBoolean,  // only applied when values are set or deleted
        };

        const boxedState_$ = _$.withBoxOptions(transforms, state);

        // getting the value of the boxedState_$. will yield:
        let reportedState = {
            numFlag: false,
            nullFlag: false,
            stringFlag: true,
            arrFlag: true,
            objFlag: true,
        };
        expect(boxedState_$.$_value).toEqual(reportedState);

        // setting any flag, including a new one will apply the transform because we have also provided a setTransform
        boxedState_$.newFlag = 5;

        let flag = boxedState_$.newFlag();  // flag will equal true
        expect(flag).toBe(true);
    });
});

