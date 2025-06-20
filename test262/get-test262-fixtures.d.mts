export default function (): AsyncGenerator<{
  file: string;
  contents: string;
  sourceType?: 'module' | 'script';
}>;
