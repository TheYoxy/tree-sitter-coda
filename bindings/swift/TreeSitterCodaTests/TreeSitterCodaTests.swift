import XCTest
import SwiftTreeSitter
import TreeSitterCoda

final class TreeSitterCodaTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_coda())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Coda grammar")
    }
}
