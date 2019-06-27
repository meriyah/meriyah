import { parseSource } from './parser';
export function parseScript(source, options) {
    return parseSource(source, options, 0);
}
export function parseModule(source, options) {
    return parseSource(source, options, 1024 | 2048);
}
export function parse(source, options) {
    return parseSource(source, options, 0);
}
export const version = '0.6.2';
//# sourceMappingURL=meriyah.js.map