package tree_sitter_multibase_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_multibase "github.com/tree-sitter/tree-sitter-multibase/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_multibase.Language())
	if language == nil {
		t.Errorf("Error loading MultiBase grammar")
	}
}
