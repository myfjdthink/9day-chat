declare module 'markdown-it' {
  interface MarkdownIt {
    render(content: string): string;
  }

  interface Options {
    html?: boolean;
    xhtmlOut?: boolean;
    breaks?: boolean;
    langPrefix?: string;
    linkify?: boolean;
    typographer?: boolean;
    quotes?: string | string[];
    highlight?: (str: string, lang: string) => string | void;
  }

  interface MarkdownItConstructor {
    new (options?: Options): MarkdownIt;
    (options?: Options): MarkdownIt;
  }

  const MarkdownIt: MarkdownItConstructor;
  export = MarkdownIt;
} 