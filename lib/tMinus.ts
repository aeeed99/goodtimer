
interface Config {
    divider: string;
    devMode: boolean;
}
interface TimerOptions {
    divider?: string; // default ":"
    immediateInterval?: boolean; // default true
    onTimeout?: Function;
    onInterval?: Function;
    repeat?: number; // default 0
}

class Timer {

    secs: number[];
    mins: number[];
    hours: number[];
    days: number[];
    years: number[];
    options: TimerOptions = {
        divider: ":",
        repeat: 0,
        immediateInterval: true
    }

    constructor(time: string, timeUpFn?: Function, intervalFn?: Function);
    constructor(time: string, options: TimerOptions)
    constructor(time: string, fnOrOptions: Function|TimerOptions) {
        this.secs = [0];
        this.mins = [0];
        this.hours = [0];
        this.days = [0];
        this.years = [0];
    }

    setFromString(time: string): void {

    }

    adjustTime(seconds: number=-1) {
        /** Adjusts time by a number of seconds. Pass negative number to decrement.
         */
        const { adjustAndCarry: aac } = this;

        aac(this.years, 364,
            aac(this.days, 23,
                aac(this.hours, 59,
                    aac(this.mins, 59,
                        aac(this.secs, 59, seconds)))))
    }

    private adjustAndCarry(num: number[], resetValue: number, interval: number): number {
        if (!interval) {
            return 0;
        }
        let val: number = num[0] + interval;
        let carry: number = 0;
        while (val < 0) {
            val += resetValue;
            carry -= 1;
        }
        while (val > resetValue) {
            val -= resetValue;
            carry += 1;
        }
        num[0] = val;
        return carry;
    }

}