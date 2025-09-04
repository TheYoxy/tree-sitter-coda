(record_type) @function
(transaction_subtype) @markup.strong @parameter
(information_subtype) @markup.strong @parameter

(date) @markup @keyword
(bic) @markup.strong @parameter
(sign) @method
((sign) @markup.strong (#match? @markup.strong "1"))
((sign) @string.special (#match? @string.special "1"))
(next_data_record) @string
((next_data_record) @markup.strong (#match? @markup.strong "1"))
((next_data_record) @string.special (#match? @string.special "1"))
(next_code) @string
((next_code) @markup.strong (#match? @markup.strong "1"))
((next_code) @string.special (#match? @string.special "1"))
(next_file) @string
((next_file) @markup.strong (#match? @markup.strong "1"))
((next_file) @string.special (#match? @string.special "1"))

(blank) @markup.strike @comment.note @punctuation.whitespace
(zeros) @constant.numeric @markup.italic

(seq_number3) @markup.strong @function.macro
(seq_number4) @markup.strong @namespace
(detail_number) @markup.italic @string
(reference_number) @markup.strong @method

(communication_small) @markup.strong @field
(communication_short) @markup.strong @field
(communication) @markup.strong @field
(communication_long) @markup.strong @field
(message) @markup.strong @field

(alnum4) @markup.underline
(file_reference) @markup.underline @string.special
(alnum16) @markup.underline
(name) @markup.underline @string
(customer_reference) @markup.underline
(account_number) @markup.underline @keyword
(amount) @number

(transaction_code) @markup.strong @markup.italic
(transaction_code type: (transaction_code_type) @string.special.symbol)
(transaction_code family: (transaction_code_family) @string)
(transaction_code operation: (transaction_code_operation) @string.special)
(transaction_code category: (transaction_code_category) @constant)

(header_record application_code: (application_code) @parameter)
(header_record (duplication_flag) @error (#match? @error "D"))
(header_record account_holder_id: (account_holder_id) @string.special)
(header_record separate_application_code: (numeric5) @number)
(header_record transaction_reference: (alnum16) @string)
(header_record related_reference_or_blank: (alnum16) @string.special)
(header_record version_code: (version_code) @attribute)

(old_balance_record account_structure: (account_structure) @parameter)
(old_balance_record account_description: (customer_reference) @string.special)

(transaction_record_part1 communication_type: (structured_flag) @method)
(transaction_record_part1 communication_type: (structured_flag) @string.special (#match? @string.special "1"))
(transaction_record_part1 account_seq: (numeric3) @number)
(transaction_record_part1 globalisation_code: (numeric1) @string.special)

(transaction_record_part2 customer_reference: (customer_reference) @string.special)
(transaction_record_part2 transaction_type: (transaction_type) @markup.strong)
(transaction_record_part2 iso_reason: (alnum4) @markup.strong @string)
(transaction_record_part2 category_purpose: (alnum4) @string.special)
(transaction_record_part2 purpose: (alnum4) @string.special)

(transaction_record_part3 counter_party_name: (customer_reference) @string.special)

(information_record_part1 structured_communication: (structured_communication) @method)
(information_record_part1 structured_communication: (structured_communication) @string.special (#match? @string.special "1"))

(trailer_record number_of_record: (numeric6) @number)
(trailer_record debit_movements: (numeric15) @string.special)
(trailer_record credit_movements: (numeric15) @string)
(ERROR) @markup.strike @markup.italic @error ; default error
