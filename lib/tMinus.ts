
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

    secs: number;
    mins: number;
    hours: number;
    days: number;
    years: number;
    options: TimerOptions = {
        divider: ":",
        repeat: 0,
        immediateInterval: true
    }

    constructor(time: string, timeUpFn?: Function, intervalFn?: Function);
    constructor(time: string, options: TimerOptions)
    constructor(time: string, fnOrOptions: Function|TimerOptions) {
        this.secs = 0;
        this.mins = 0;
        this.days = 0;
        this.hours = 0;
        this.years = 0;
    }

    setFromString(time: string): void {

    }

}