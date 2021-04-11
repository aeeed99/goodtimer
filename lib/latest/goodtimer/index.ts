import { Timer, TimerOptions} from "./timer";
import { Time } from "./time";
import * as timeutil from "./timeutil"

try {
    module.exports = {Timer, Time, timeutil};
}
catch {
    // @ts-ignore
    window.goodtimer = {Timer, Time, timeutil}
}