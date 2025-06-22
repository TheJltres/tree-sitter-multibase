/*
 * @file Parser for the base100 language MultiBase
 * @author Jose Luis Tresserras Merino <joseluistresserras@antex.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "multibase",

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.comment,

      $.database,
      $.define,
      $.main,
      $.pause,
    ),

    comment: $=> seq(
      '{',
      repeat(/[^{}]/),
      '}',
    ),

    database: $ => seq(
      $.database_kw,
      $.database_name,
    ),
    database_kw: $ => token(
      /database/i
    ),
    database_name: $ => $.identifier,

    define: $ => seq(
      $.define_kw,
      optional($.define_variables),
      optional($.define_parameters),
      $.end_define_kw,
    ),
    define_kw: $ => token(
      /define/i
    ),
    end_define_kw: $ => token(
      /end define/i
    ),
    define_variables: $ => seq(
      optional(
        seq(
          optional(
            token(/new/i),
          ),
          token(/shared/i),
        ),
      ),

      token(/variable/i),

      $.identifier,

      choice(
        seq(
          token(/like/i),
          $.identifier,
          '.',
          $.identifier,
        ),
        $.variable_types,
      ),

      optional($.atributes),
    ),
    define_parameters: $ => seq(
      token(/parameter/i),

      optional($.number),

      $.identifier,

      choice(
        seq(
          token(/like/i),
          $.identifier,
          '.',
          $.identifier,
        ),
        $.variable_types,
      ),

      optional($.atributes),
    ),
    define_arrays: $ => seq(
      token(/array/i),
      $.identifier,
      optional($.number),

      $.variable_types
    ),

    main: $ => seq(
      $.main_kw,
      optional($._definition), // TODO: Change for instructions
      $.end_main_kw,
    ),
    main_kw: $ => token(/main begin/i),
    end_main_kw: $ => token(/end main/i),

    pause: $ => seq(
      $.pause_kw,
      optional($.pause_expression),
      optional(
        choice(
          $.reverse_kw,
          $.underline_kw,
        ),
      ),
      optional(
        $.bell_kw,
      ),
    ),
    pause_kw: $ => token(/pause/i),
    pause_expression: $ => choice(
      $.string_literal,
      $.identifier,
      $.number,
    ),

    variable: $ => choice(
      $.variable_columns,
    ),
    variable_types: $ => choice(
      seq(
        token(/char/i),
        '(',
        $.number,
        ')',
      ),

      token(/smallint/i),

      token(/integer/i),

      token(/time/i),

      seq(
        token(/decimal/i),
        optional(
          seq(
            '(',
            $.number,
            optional(
              seq(
                ',',
                $.number,
              ),
            ),
            ')',
          ),
        ),
      ),

      seq(
        token(/serial/i),
        optional(
          seq(
            '(',
            $.number,
            ')',
          ),
        ),
      ),

      token(/date/i),

      seq(
        token(/money/i),
        optional(
          seq(
            '(',
            $.number,
            optional(
              seq(
                ',',
                $.number,
              ),
            ),
            ')',
          ),
        ),
      ),

    ),

    variable_columns: $=> seq(
      choice(
        seq(
          $.identifier,
          '=',
        ),
        token(/untagged/i),
      ),
      optional(
        seq(
          $.identifier,
          '.'
        ),
      ),
      $.identifier,
      optional(
        seq(
          token(/lines/i),
          $.number,
        ),
      ),
      optional($.atributes)
    ),

    atributes: $=> choice(
      token(/autonext/i),
      token(/check/i), // TODO: Add expressions
      token(/noupdate/i),
      token(/picture/i),
      seq(
        token(/comments/i),
        optional(
          choice(
            $.string_literal,
            $.number,
          ),
        ),
      ),
      token(/queryclear/i),
      seq(
        token(/default/i),
        $.number,
      ),
      token(/required/i),
      token(/downshift/i),
      $.reverse_kw,
      seq(
        token(/format/i),
        $.string_literal,
      ),
      token(/right/i),
      seq(
        token(/help/i),
        $.number,
      ),
      token(/scroll/i),
      token(/include/i), // TODO: Add values
      $.underline_kw,
      seq(
        token(/label/i),
        optional(
          choice(
            $.string_literal,
            $.number,
          ),
        ),
      ),
      token(/upshift/i),
      token(/left/i),
      token(/verify/i),
      token(/lookup/i), // TODO: Add missing fields
      token(/zerofill/i),
      token(/noentry/i),
    ),

    reverse_kw: $ => token(/reverse/i),
    underline_kw: $ => token(/underline/i),
    bell_kw: $ => token(/bell/i),

    identifier: $ => /[a-z]+/,
    number: $ => /\d+/,
    string_literal: $ => /"([^"\\]|\\.)*"/,
  }
});
