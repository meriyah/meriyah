/** @returns {boolean} */
const testFeature = (test) => {
  try {
    return test() === true;
  } catch {
    return false;
  }
};

// eslint-disable-next-line n/no-unsupported-features/es-syntax
export const supportsUnicodeSets = testFeature(() => new RegExp('', 'v').unicodeSets);
export const supportsModifiers = testFeature(() => new RegExp('(?i:a)').test('A'));
export const supportsDuplicateNamedCapturingGroups = testFeature(() => new RegExp('(?<group>a)|(?<group>b)').test('b'));
