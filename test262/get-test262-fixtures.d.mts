export type TestCase = {
  file: string;
  contents: string;
  sourceType: 'module' | 'script';
};

export default function (paths?: string[]): AsyncGenerator<TestCase>;
