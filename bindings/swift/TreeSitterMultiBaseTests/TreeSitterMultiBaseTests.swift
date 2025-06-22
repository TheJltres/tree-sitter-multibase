import XCTest
import SwiftTreeSitter
import TreeSitterMultibase

final class TreeSitterMultibaseTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_multibase())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading MultiBase grammar")
    }
}
