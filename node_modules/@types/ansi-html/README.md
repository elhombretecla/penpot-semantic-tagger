# Installation
> `npm install --save @types/ansi-html`

# Summary
This package contains type definitions for ansi-html (https://github.com/Tjatse/ansi-html).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/ansi-html.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/ansi-html/index.d.ts)
````ts
declare namespace ansiHTML {
    interface Colors {
        reset: string | readonly string[];
        black: string;
        red: string;
        green: string;
        yellow: string;
        blue: string;
        magenta: string;
        cyan: string;
        lightgrey: string;
        darkgrey: string;
    }

    interface Tags {
        open: { [key: number]: string };
        close: { [key: number]: string };
    }

    interface AnsiHTML {
        (text: string): string;
        setColors(colors: Partial<Colors>): void;
        reset(): void;
        tags: Tags;
    }
}

declare const ansiHTML: ansiHTML.AnsiHTML;
export = ansiHTML;

````

### Additional Details
 * Last updated: Sat, 30 Dec 2023 06:35:31 GMT
 * Dependencies: none

# Credits
These definitions were written by [Sherlock Doyle](https://github.com/sherlockdoyle).
