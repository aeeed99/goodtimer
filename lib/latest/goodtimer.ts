import { Timer, TimerOptions} from "./timer";
import { Time } from "./time";

try {
    module.exports = {Timer, Time};
}
catch {
    // @ts-ignore
    window.goodtimer = {Timer, Time}
}