export default function (paths?: string[]): AsyncGenerator<{
  file: string;
  contents: string;
  sourceType?: 'module' | 'script';
}>;
