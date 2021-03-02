
export function addPadding(number: number, zeros: number): string {
    let value = String(number);
    // @ts-ignore
    return "0".repeat(Math.max(zeros - value.length, 0)) + value;
}