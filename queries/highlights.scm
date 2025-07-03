(comment) @comment

(database
  (kw_database) @keyword
  (identifier) @constant)

(define_type_like
  (kw_like) @keyword
  (identifier) @class
  (_ (identifier) @field))

(attribute_include_value
  (number) @number)

(kw_define) @keyword
(kw_end_define) @keyword
(kw_main) @keyword
(kw_end_main) @keyword
(function
  (kw_function) @keyword
  (identifier) @function
  (kw_end_function) @keyword)

(kw_begin) @keyword
(kw_end) @keyword

(kw_new) @keyword
(kw_shared) @keyword
(kw_default) @keyword
(kw_variable) @keyword
(kw_parameter) @keyword
(kw_pause) @keyword
(kw_reverse) @keyword
(kw_underline) @keyword
(kw_required) @keyword
(kw_bell) @keyword
(kw_include) @keyword
(kw_to) @keyword

(atributes) @attribute
(variable_type) @type

(kw_parentesis_left) @punctuation.parentesis
(kw_parentesis_right) @punctuation.parentesis
(kw_bracket_left) @punctuation.bracket
(kw_bracket_right) @punctuation.bracket
(kw_comma) @punctuation.delimiter
(kw_dot) @punctuation.delimiter

(string_literal) @string
(identifier) @variable
(number) @number

