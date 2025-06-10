/** @returns {boolean} */
const testFeature = (test) => {
  try {
    return test() === true;
  } catch {
    return false;
  }
};

export const regexFeatures = {
  // eslint-disable-next-line n/no-unsupported-features/es-syntax
  unicodeSets: testFeature(() => new RegExp('', 'v').unicodeSets),
  modifiers: testFeature(() => new RegExp('(?i:a)').test('A')),
  duplicateNamedCapturingGroups: testFeature(() => new RegExp('(?<group>a)|(?<group>b)').test('b')),
};
