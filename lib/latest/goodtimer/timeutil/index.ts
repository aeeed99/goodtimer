export function addPadding(number: number, zeros: number): string {
    let value = String(number);
    // @ts-ignore
    return "0".repeat(Math.max(zeros - value.length, 0)) + value;
}

const goodIntervalIds: boolean[] = [];
let nextId: number = 0;

/** A self-correcting version of [[setTimeout]], which will "speed up"
 *  subsequent calls if it falls behind (as a result of being behind too many
 *  other queued events on the event loop).
 *
 *  Can potentially cause a "burst" of the same calls, if for some reason
 *  it falls very behind.
 */
export function setGoodInterval(
    callback: Function,
    timeout: number,
    maxCorrection: number,
    _id: number = null,
    _lastCall: number = Date.now()): number {


    const wrapper = function(callback: Function, timeout, _lastCall, _id: number) {
        if (!goodIntervalIds[_id]) {
            return;
        }
        const callTime = Date.now();
        console.log('timeout', timeout);
        callback();
        const adjustment = callTime - _lastCall - timeout;
        console.log('adjustment is ', adjustment)
        const adjustedTimeout = timeout - adjustment;
        const adjustedCallTime = callTime - adjustment;
        console.log('adjusted timeout is ', adjustedTimeout);
        console.log('>> next lastCall will be', Date.now() - start);
        setTimeout(
            () => wrapper(callback, timeout, adjustedCallTime, _id),
            adjustedTimeout
        )
    };
    const start = Date.now();
    const id = nextId++;
    goodIntervalIds[id] = true;

    setTimeout(
        function() { wrapper(callback, timeout, start, id) },
        timeout
    );
    return id;
}

export function clearGoodInterval(id) {
    goodIntervalIds[id] = false;
}