'use strict';

const boxed = require('./lib/boxed-immutable');
const boxedState = require('./lib/boxed-state');
const boxOut = require('boxed-out');

boxed.BoxedState = boxedState.BoxedState;
boxed.boxState = boxedState.boxState;
boxed.boxOut = boxOut;

module.exports = {
    default: boxed.box,
    "_$": boxed.box,
    "$_": boxed.boxOut,
    box: boxed.box,
    createBox: boxed.createBox,
    defaultCanBox: boxed.defaultCanBox,
    boxState: boxed.boxState,
    boxOut: boxed.boxOut,

    // mostly for testing
    boxed: boxed,
};
