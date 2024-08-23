declare module 'test262-parser-runner' {
  type Parse = (src: string, { sourceType }: { sourceType: 'module' | 'script' }) => any;
  type Options = {
    testsDirectory?: string;
    skip(test: any): boolean;
    whitelist: string[];
  };

  function run(parse: Parse, options: Options): Promise<void>;

  export = run;
}
