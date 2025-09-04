# Tree-sitter Coda parser

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for parsing Coda bank statement files.

## Features

- Parses the Coda file format used for Belgian bank statements.
- Supports all record types: header, balance, transaction, information, message, trailer, etc.
- Provides detailed syntax trees for further analysis or tooling.

## Installation & Usage in Neovim

To use this grammar in Neovim with [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter):

1. Clone this repository somewhere on your system.
2. Add the following to your Neovim config (e.g. `init.lua`):

   ```lua
   require'nvim-treesitter.parsers'.get_parser_configs().coda = {
     install_info = {
       url = "https://github.com/TheYoxy/tree-sitter-coda", 
       files = {"src/parser.c"}, 
       branch = "master",
     },
     filetype = "coda",
   }
   ```

3. Set up filetype detection for `.coda` files, e.g. in your Neovim config:

   ```lua
   vim.filetype.add({
     extension = {
       coda = "coda",
     }
   })
   ```

4. Run `:TSInstall coda` in Neovim (if using a remote repo) or restart Neovim to load the grammar.

Now, syntax highlighting and parsing for Coda files will be available in Neovim.

## License

MIT © Floryan Simar
