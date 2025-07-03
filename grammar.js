/*
 * @file Parser for the base100 language MultiBase
 * @author Jose Luis Tresserras Merino <joseluistresserras@antex.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "multibase",

  extras: $ => [
    $.comment,
    /\s/,
  ],

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.database,
      $.define,
      $.global,
      $.local,
      $.main,
      $.function,
      $.pause,
    ),

    //#region Comment

    comment: $=> seq(
      '{',
      repeat(/[^{}]/),
      '}',
    ),

    //#endregion

    //#region Database

    database: $ => seq(
      $.kw_database,
      $.identifier,
    ),

    //#endregion

    //#region Define

    define: $ => seq(
      $.kw_define,
      optional($.define_body),
      $.kw_end_define,
    ),

    define_body: $ => repeat1(
      choice(
        $.define_variable,
        $.define_parameter,
      )
    ),

    define_variable: $ => seq(
      optional($.kw_variable_shared),
      $.kw_variable,
      $.identifier,
      $.define_type,
      repeat($.atributes)
    ),

    define_parameter: $ => seq(
      $.kw_parameter,
      optional($.define_parameter_order),
      $.identifier,
      $.define_type,

      repeat($.atributes)
    ),

    define_parameter_order: $ => seq(
      $.kw_bracket_left,
      $.number,
      $.kw_bracket_right,
    ),

    define_type: $ => choice(
      $.define_type_like,
      $.variable_type,
    ),

    define_type_like: $ => seq(
      $.kw_like,
      $.identifier,
      $.kw_dot,
      $.identifier,
    ),

    //#endregion

    //#region Global

    global: $ => seq(
      $.kw_global,
      optional($.global_control),
      optional($.options),
      $.kw_end_global,
    ),

    global_control: $ => seq(
      $.kw_control,
      // TODO: OnBeginning, OnEnding, OnKey, OnAction
      $.kw_end_control,
    ),

    //#endregion

    //#region Local

    local: $ => seq(
      $.kw_local,
      optional($.options),
      $.kw_end_local,
    ),

    //#endregion

    //#region Instructions

    options: $ => seq(
      $.kw_options,
      repeat1($.options_body),
      $.kw_end_options,
    ),

    options_body: $ => choice(
      $.options_help_file,
      $.options_help_box,
      $.options_message_line,
      $.options_prompt_line,
      $.options_menu_line,
      $.options_help_message,
      $.options_printer,
      $.options_no_shell,
      $.options_no_message,
      $.options_message_on,
    ),

    options_help_file: $ => seq(
      $.kw_help,
      $.kw_file,
      $.string_literal,
    ),

    options_help_box: $ => seq(
      $.kw_help,
      $.kw_box,
      $.kw_at,
      $.number,
      $.kw_comma,
      $.number,
      $.kw_with,
      $.number,
      $.kw_comma,
      $.number,
    ),

    options_message_line: $ => seq(
      $.kw_message,
      $.kw_line,
      $.number,
    ),

    options_prompt_line: $ => seq(
      $.kw_prompt,
      $.kw_line,
      $.number,
    ),

    options_menu_line: $ => seq(
      $.kw_menu,
      $.kw_line,
      $.number,
    ),

    options_help_message: $ => seq(
      $.kw_help,
      $.kw_message,
      $.number,
    ),

    options_printer: $ => seq(
      $.kw_printer,
      // TODO: Know what expression means
    ),

    options_no_shell: $ => seq(
      $.kw_no,
      $.kw_shell,
    ),

    options_no_message: $ => seq(
      $.kw_no,
      $.kw_message,
    ),

    options_message_on: $ => seq(
      $.kw_message,
      $.kw_on,
    ),

    //#endregion

    //#region Main

    main: $ => seq(
      $.kw_main_begin,
      optional($._definition), // TODO: Change for instructions
      $.kw_end_main,
    ),

    //#endregion

    //#region Function

    function: $ => seq(
      $.kw_function,
      $.identifier,
      $.kw_parentesis_left,
      optional($.function_parameters),
      $.kw_parentesis_right,
      repeat($.function_variable),
      $.kw_begin,
      optional($._definition), // TODO: Change for instructions
      $.kw_end_function,
    ),

    function_parameters: $ => seq(
      $.identifier,
      repeat(
        seq(
          $.kw_comma,
          $.identifier,
        ),
      ),
    ),

    function_variable: $ => seq(
      $.identifier,
      $.define_type,
    ),

    //#endregion

    //#region Menu

    //#endregion

    //#region Pulldown

    //#endregion


    //#region Pause

    pause: $ => seq(
      $.kw_pause,
      optional($.pause_expression),
      optional($.pause_atributes),
      optional($.kw_bell),
    ),

    pause_atributes: $ => choice(
      $.kw_underline,
      $.kw_reverse,
      seq(
        $.kw_underline,
        $.kw_reverse,
      ),
      seq(
        $.kw_reverse,
        $.kw_underline,
      ),
    ),

    pause_expression: $ => choice(
      $.string_literal,
      $.identifier,
      $.number,
    ),

    //#endregion

    //#region Variable types

    variable_type: $ => choice(
      $.variable_type_char,
      $.kw_smallint,
      $.kw_integer,
      $.kw_time,
      $.variable_type_decimal,
      $.variable_type_serial,
      $.kw_date,
    ),

    variable_type_char: $ => seq(
      $.kw_char,
      $.kw_parentesis_left,
      $.number,
      $.kw_parentesis_right,
    ),

    variable_type_serial: $ => seq(
      $.kw_serial,
      optional(
        seq(
          $.kw_parentesis_left,
          $.number,
          $.kw_parentesis_right,
        ),
      ),
    ),

    variable_type_decimal: $ => seq(
      choice(
        $.kw_decimal,
        $.kw_money
      ),
      optional(
        seq(
          $.kw_parentesis_left,
          $.number,
          optional(
            seq(
              $.kw_comma,
              $.number,
            ),
          ),
          $.kw_parentesis_right,
        ),
      ),
    ),

    //#endregion

    atributes: $=> choice(
      $.kw_autonext,
      $.kw_check,
      $.kw_noupdate,
      $.kw_picture,
      seq(
        $.kw_comments,
        optional(
          choice(
            $.string_literal,
            $.number,
          ),
        ),
      ),
      $.kw_queryclear,
      $.atribute_default,
      $.kw_required,
      $.kw_downshift,
      $.kw_reverse,
      seq(
        $.kw_format,
        $.string_literal,
      ),
      $.kw_right,
      seq(
        $.kw_help,
        $.number,
      ),
      $.kw_scroll,
      $.attribute_include,
      $.kw_underline,
      seq(
        token(/label/i),
        optional(
          choice(
            $.string_literal,
            $.number,
          ),
        ),
      ),
      $.kw_upshift,
      $.kw_left,
      $.kw_verify,
      $.kw_lookup,
      $.kw_zerofill,
      $.kw_noentry,
    ),

    atribute_default: $ => seq(
      $.kw_default,
      $.number,
    ),

    attribute_include: $ => seq(
      $.kw_include,
      $.kw_parentesis_left,
      repeat(
        seq(
          $.attribute_include_value,
          repeat(
            seq(
              $.kw_comma,
              $.attribute_include_value,
            ),
          ),
        ),
      ),
      $.kw_parentesis_right,
    ),

    attribute_include_value: $ => choice(
      $.string_literal,
      $.identifier,
      $.number,
      seq(
        $.number,
        $.kw_to,
        $.number,
      ),
    ),

    //#region Keywords

    keywords: $ => choice(
      $.kw_database,
      // TODO: Add all the keywords in some order
    ),

    kw_database: $ => token(/database/i),

    kw_define: $ => token(/define/i),
    kw_end_define: $ => seq(
      $.kw_end,
      $.kw_define,
    ),

    kw_main: $ => token(/main/i),
    kw_main_begin: $ => seq(
      $.kw_main,
      $.kw_begin
    ),
    kw_end_main: $ => seq(
      $.kw_end,
      $.kw_main,
    ),

    kw_global: $ => token(/global/i),
    kw_end_global: $ => seq(
      $.kw_end,
      $.kw_global,
    ),

    kw_local: $ => token(/local/i),
    kw_end_local: $ => seq(
      $.kw_end,
      $.kw_local,
    ),


    kw_control: $ => token(/control/i),
    kw_end_control: $ => seq(
      $.kw_end,
      $.kw_control
    ),

    kw_options: $ => token(/options/i),
    kw_end_options: $ => seq(
      $.kw_end,
      $.kw_options
    ),

    kw_function: $ => token(/function/i),
    kw_end_function: $ => seq(
      $.kw_end,
      $.kw_function,
    ),

    kw_begin: $ => token(/begin/i),
    kw_end: $ => token(/end/i),

    kw_pause: $ => token(/pause/i),

    kw_variable: $ => token(/variable/i),
    kw_new: $ => token(/new/i),
    kw_shared: $ => token(/shared/i),
    kw_parameter: $ => token(/parameter/i),
    kw_like: $ => token(/like/i),
    kw_array: $ => token(/array/i),
    kw_bell: $ => token(/bell/i),

    kw_variable_shared: $ => seq(
      optional($.kw_new),
      $.kw_shared,
    ),

    // Types
    kw_char: $ => token(/char/i),
    kw_smallint: $ => token(/smallint/i),
    kw_integer: $ => token(/integer/i),
    kw_time: $ => token(/time/i),
    kw_decimal: $ => token(/decimal/i),
    kw_serial: $ => token(/serial/i),
    kw_date: $ => token(/date/i),
    kw_money: $ => token(/money/i),

    // Atributes
    kw_autonext: $ => token(/autonext/i),
    kw_check: $ => token(/check/i), // TODO: Add expressions
    kw_noupdate: $ => token(/noupdate/i),
    kw_picture: $ => token(/picture/i),
    kw_comments: $ => token(/comments/i),
    kw_queryclear: $ => token(/queryclear/i),
    kw_default: $ => token(/default/i),
    kw_required: $ => token(/required/i),
    kw_downshift: $ => token(/downshift/i),
    kw_reverse: $ => token(/reverse/i),
    kw_format: $ => token(/format/i),
    kw_right: $ => token(/right/i),
    kw_help: $ => token(/help/i),
    kw_scroll: $ => token(/scroll/i),
    kw_include: $ => token(/include/i),
    kw_underline: $ => token(/underline/i),
    kw_upshift: $ => token(/upshift/i),
    kw_left: $ => token(/left/i),
    kw_verify: $ => token(/verify/i),
    kw_lookup: $ => token(/lookup/i), // TODO: Add missing fields
    kw_zerofill: $ => token(/zerofill/i),
    kw_noentry: $ => token(/noentry/i),

    // Punctuation
    kw_parentesis_left: $ => '(',
    kw_parentesis_right: $ => ')',
    kw_bracket_left: $ => '[',
    kw_bracket_right: $ => ']',
    kw_dot: $ => '.',
    kw_comma: $ => ',',

    // Other
    kw_to: $ => token(/to/i),
    kw_at: $ => token(/at/i),
    kw_no: $ => token(/no/i),
    kw_on: $ => token(/on/i),
    kw_file: $ => token(/file/i),
    kw_box: $ => token(/box/i),
    kw_with: $ => token(/with/i),
    kw_message: $ => token(/message/i),
    kw_line: $ => token(/line/i),
    kw_prompt: $ => token(/prompt/i),
    kw_menu: $ => token(/menu/i),
    kw_printer: $ => token(/printer/i),
    kw_shell: $ => token(/shell/i),

    //#endregion

    identifier: $ => /[a-zA-Z][a-zA-Z0-9]*/,
    number: $ => /\d+/,
    string_literal: $ => /"([^"\\]|\\.)*"/,
  }
});
