package tree_sitter_coda_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_coda "github.com/tree-sitter/tree-sitter-coda/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_coda.Language())
	if language == nil {
		t.Errorf("Error loading Coda grammar")
	}
}
