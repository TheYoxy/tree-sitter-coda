# Tree-sitter Coda parser

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for parsing CODA bank statement files (Febelfin CODA v2.8).

## Features

- Parses `.coda` and `.cod` files.
- Supports every record type: header (0), old balance (1), movement (2.1/2.2/2.3), information (3.1/3.2/3.3), free communication (4), new balance (8) and trailer (9).
- Parses all documented structured communication types from Annexe III. A structured value that spans several 128-character records keeps the same field name on each physical line, so amounts, dates, card data, securities data, etc. stay individually addressable.
- Accepts LF and CRLF line endings and files without a trailing newline.
- Malformed records produce `ERROR` nodes instead of being silently accepted.

## Highlighting

`queries/coda/highlights.scm` targets Neovim/nvim-treesitter captures:

- each record class (0, 1, 2, 3, 4, 8, 9) has its own colour;
- every field in every record kind has a per-record colour assignment;
- adjacent fields never resolve to the same colour, so records can be scanned quickly;
- dates, amounts, references, names, flags, code types and padding use separate semantic captures where possible.

The query is generated from the grammar and record layouts:

```sh
npm run highlights
```

The generated colours are calibrated against Catppuccin. Another colourscheme may map two captures to the same colour.

## Installation & Usage in Neovim

1. Clone this repository somewhere on your system.
2. Register the parser with your nvim-treesitter setup. The exact snippet depends on your nvim-treesitter version; the parser uses the standard `queries/coda/highlights.scm` location.
3. Set up filetype detection for `.coda` files:

   ```lua
   vim.filetype.add({
     extension = {
       coda = "coda",
       cod = "coda",
     }
   })
   ```

4. Install/compile the parser with `:TSInstall coda` (remote repo) or by pointing nvim-treesitter at this checkout.

Now, syntax highlighting and parsing for CODA files will be available in Neovim.

## Development

```sh
tree-sitter generate
tree-sitter test
tree-sitter parse example/example.cod
npm run highlights
```

The corpus lives in `test/corpus/records.txt`.

## License

MIT © Floryan Simar
