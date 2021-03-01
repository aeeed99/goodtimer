//const {jest} = require('@jest/globals')
let {Timer} = require('../build/goodtimer');

describe('tick', () => {
    // tick is the function that runs on a setInterval loop. Generally, it's not invoked directly, but is useful
    // to do so for testing.

    it('decrements the timer', () => {
        const t = new Timer(':05');
        expect(t._secs).toStrictEqual([5]);
        t.tick();
        expect(t._secs).toStrictEqual([4]);
        t.tick();
        expect(t._secs).toStrictEqual([3]);
    });

    it('invokes callback functions', () => {
        // the onTimeout function runs when the timer reaches 0.
        // the onInterval function runs on every tick
        const timerFunctions = {
            timeout: function(){},
            interval: function(){}
        }
        const timeoutFn = jest.spyOn(timerFunctions, 'timeout');
        const intervalFn = jest.spyOn(timerFunctions, 'interval');

        const t = new Timer('2s', {onTimeout: timeoutFn, onInterval: intervalFn});

        expect(timeoutFn).not.toHaveBeenCalled();
        expect(intervalFn).not.toHaveBeenCalled();
        t.tick();
        expect(intervalFn).toHaveBeenCalled();
        expect(timeoutFn).not.toHaveBeenCalled();
        t.tick();
        expect(timeoutFn).toHaveBeenCalled();
    })
})