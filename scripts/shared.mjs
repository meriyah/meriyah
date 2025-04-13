/** @type {boolean} */
const supportsUnicodeSets = (() => {
  try {
    // eslint-disable-next-line n/no-unsupported-features/es-syntax
    return new RegExp('', 'v').unicodeSets;
  } catch {
    return false;
  }
})();

export { supportsUnicodeSets };
