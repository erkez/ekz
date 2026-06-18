export function unreachable(value: never): never {
    throw new TypeError(`Unexpected unreachable value [${value}]`);
}
