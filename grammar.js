/**
 * @file PARSER_DESCRIPTION
 * @author Floryan Simar floryan.simar@endevops.be
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'coda',

  extras: () => ['\n'],
  rules: {
    // Entire file: sequence of fixed-length records each ending with optional LF
    source_file: $ => repeat($.record),

    record: $ =>
      seq(
        choice(
          $.header_record,
          $.old_balance_record,
          $.transaction_record_part1,
          $.transaction_record_part2,
          $.transaction_record_part3,
          $.information_record_part1,
          $.information_record_part2,
          $.information_record_part3,
          $.message_record,
          $.new_balance_record,
          $.trailer_record
        ),
        '\n'
      ),
    header_record: $ =>
      seq(
        field('record_type', alias('0', $.record_type)),
        field('zeros', alias('0000', $.zeros)),
        field('creation_date', $.date),
        field('seq_number', $.seq_number3),
        field('application_code', alias('05', $.application_code)),
        field('duplication_flag', $.duplication_flag),
        field('blank', alias(/ {7}/, $.blank)),
        field('file_reference_or_blank', $.file_reference),
        field('addressee_name', $.name),
        field('bic', $.bic),
        field('account_holder_id', $.account_holder_id),
        field('blank', alias(/ /, $.blank)),
        field('separate_application_code', $.numeric5),
        field('transaction_reference', $.alnum16),
        field('related_reference_or_blank', $.alnum16),
        field('blank', alias(/ {7}/, $.blank)),
        field('version_code', alias('2', $.version_code))
      ),

    old_balance_record: $ =>
      seq(
        field('record_type', alias('1', $.record_type)),
        field('account_structure', $.account_structure),
        field('seq_number', $.seq_number3),
        field('account_number_and_currency', $.account_number),
        field('sign', $.sign),
        field('amount', $.amount),
        field('date', $.date),
        field('account_holder_name', $.name),
        field('account_description', $.customer_reference),
        field('coded_statement_sequence_or_zeros', $.seq_number3)
      ),

    transaction_record_part1: $ =>
      seq(
        field('record_type', alias('2', $.record_type)),
        field('transaction_subtype', alias('1', $.transaction_subtype)),
        field('seq_number', $.seq_number4),
        field('detail_number', $.detail_number),
        field('reference_number', $.reference_number),
        field('movement_sign', $.sign),
        field('amount', $.amount),
        field('value_date', $.date),
        field('transaction_code', $.transaction_code),
        field('communication_type', $.structured_flag),
        field('communication', $.communication_short),
        field('entry_date', $.date),
        field('account_seq', $.numeric3),
        field('globalisation_code', $.numeric1),
        field('next_code', $.next_code),
        field('blank', alias(/ /, $.blank)),
        field('next_data_record', $.next_data_record)
      ),

    transaction_record_part2: $ =>
      seq(
        field('record_type', alias('2', $.record_type)),
        field('transaction_subtype', alias('2', $.transaction_subtype)),
        field('seq_number', $.seq_number4),
        field('detail_number', $.detail_number),
        field('communication', $.communication_short),
        field('customer_reference', $.customer_reference),
        field('bic_counterparty', $.bic),
        field('blank', alias(/ {3}/, $.blank)),
        field('transaction_type', $.transaction_type),
        field('iso_reason', $.alnum4),
        field('category_purpose', $.alnum4),
        field('purpose', $.alnum4),
        field('next_code', $.next_code),
        field('blank', alias(/ /, $.blank)),
        field('next_data_record', $.next_data_record)
      ),

    transaction_record_part3: $ =>
      seq(
        field('record_type', alias('2', $.record_type)),
        field('transaction_subtype', alias('3', $.transaction_subtype)),
        field('seq_number', $.seq_number4),
        field('detail_number', $.detail_number),
        field('counter_party_account', $.account_number),
        field('counter_party_name', $.customer_reference),
        field('communication', $.communication_small),
        field('next_code', $.next_code),
        field('blank', alias(/ /, $.blank)),
        field('next_data_record', $.next_data_record)
      ),
    information_record_part1: $ =>
      seq(
        field('record_type', alias('3', $.record_type)),
        field('information_subtype', alias('1', $.information_subtype)),
        field('seq_number', $.seq_number4),
        field('detail_number', $.detail_number),
        field('reference_number', $.reference_number),
        field('transaction_code', $.transaction_code),
        field('structured_communication', $.structured_communication),
        field('communication', $.communication),
        field('blank', alias(/ {12}/, $.blank)),
        field('next_code', $.next_code),
        field('blank', alias(/ /, $.blank)),
        field('next_data_record', $.next_data_record)
      ),
    information_record_part2: $ =>
      seq(
        field('record_type', alias('3', $.record_type)),
        field('information_subtype', alias('2', $.information_subtype)),
        field('seq_number', $.seq_number4),
        field('detail_number', $.detail_number),
        field('communication', $.communication_long),
        field('blank', alias(/ {25}/, $.blank)),
        field('next_code', $.next_code),
        field('blank', alias(/ /, $.blank)),
        field('next_data_record', $.next_data_record)
      ),
    information_record_part3: $ =>
      seq(
        field('record_type', alias('3', $.record_type)),
        field('information_subtype', alias('3', $.information_subtype)),
        field('seq_number', $.seq_number4),
        field('detail_number', $.detail_number),
        field('communication', $.communication_long),
        field('next_code', $.next_code),
        field('blank', alias(/ /, $.blank)),
        field('next_data_record', $.next_data_record)
      ),
    message_record: $ =>
      seq(
        field('record_type', alias('4', $.record_type)),
        field('blank', alias(/ /, $.blank)),
        field('seq_number', $.seq_number4),
        field('detail_number', $.detail_number),
        field('blank', alias(/ {22}/, $.blank)),
        field('message', $.message),
        field('blank', alias(/ {15}/, $.blank)),
        field('next_data_record', $.next_data_record)
      ),
    new_balance_record: $ =>
      seq(
        field('record_type', alias('8', $.record_type)),
        field('seq_number', $.seq_number3),
        field('account_number', $.account_number),
        field('sign', $.sign),
        field('new_balance', $.amount),
        field('new_balance_date', $.date),
        field('blank', alias(/ {64}/, $.blank)),
        field('next_data_record', $.next_data_record)
      ),
    trailer_record: $ =>
      seq(
        field('record_type', alias('9', $.record_type)),
        field('blank', alias(/ {15}/, $.blank)),
        field('number_of_record', $.numeric6),
        field('debit_movements', $.numeric15),
        field('credit_movements', $.numeric15),
        field('blank', alias(/ {75}/, $.blank)),
        field('next_file', $.next_file)
      ),

    // ------------------------------------------------------------
    // Tokens / Helpers
    // ------------------------------------------------------------
    record_type: _ => prec(-2, token(/\d/)),
    transaction_subtype: _ => prec(-2, token(/[123]/)),
    information_subtype: _ => prec(-2, token(/[123]/)),
    application_code: _ => prec(-1, token(/05/)),
    version_code: _ => prec(-1, token(/2/)),
    zeros: _ => prec(-1, token(/0+/)),
    blank: _ => prec(-1, token(/ +/)),
    seq_number3: _ => prec(-1, token(/\d{3}/)),
    seq_number4: _ => prec(-1, token(/\d{4}/)),
    detail_number: _ => prec(-1, token(/\d{4}/)),

    duplication_flag: _ => prec(-1, token(/[D ]/)),
    account_structure: _ => prec(-1, token(/[0-3]/)),
    sign: _ => prec(-1, token(/[01]/)),
    structured_flag: _ => prec(-1, token(/[01]/)),

    // Fixed-length numeric tokens
    numeric1: _ => prec(-1, token(/\d/)),
    numeric3: _ => prec(-1, token(/\d{3}/)),
    numeric4: _ => prec(-1, token(/\d{4}/)),
    numeric5: _ => prec(-1, token(/\d{5}/)),
    numeric6: _ => prec(-1, token(/\d{6}/)),
    account_holder_id: _ => prec(-1, token(/\d{11}/)),
    numeric15: _ => prec(-1, token(/\d{15}/)),

    // Dates
    date: _ => token(/\d{6}/), // DDMMYY

    // Amount (15 numeric: 12 + 3 decimals, but format kept numeric block)
    amount: _ => token(/\d{15}/),

    // Alphanumeric fixed-length / variable-with-blanks
    alnum4: _ => prec(-1, token(/[^\n]{4}/)),
    file_reference: _ => prec(-1, token(/[^\n]{10}/)),
    alnum16: _ => prec(-1, token(/[^\n]{16}/)),
    name: _ => prec(-1, token(/[^\n]{26}/)),
    customer_reference: _ => prec(-1, token(/[^\n]{35}/)),
    account_number: _ => prec(-1, token(/[^\n]{37}/)),

    bic: _ => prec(-1, token(/[\w ]{8}(?: {3}|[\w]{3})/)),

    transaction_type: _ => prec(-1, token(/[0-5 ]/)),
    next_code: _ => prec(-1, token(/[01]/)),
    next_data_record: _ => prec(-1, token(/[01]/)),
    next_file: _ => prec(-1, token(/[12]/)),
    reference_number: _ => prec(-1, token(/[^\n]{21}/)),

    transaction_code_type: _ => prec(-1, token(/\d/)),
    transaction_code_family: _ => prec(-1, token(/\d{2}/)),
    transaction_code_operation: _ => prec(-1, token(/\d{2}/)),
    transaction_code_category: _ => prec(-1, token(/\d{3}/)),
    transaction_code: $ =>
      prec(
        -1,
        seq(
          field('type', $.transaction_code_type),
          field('family', $.transaction_code_family),
          field('operation', $.transaction_code_operation),
          field('category', $.transaction_code_category)
        )
      ),

    structured_communication: _ => prec(-1, token(/[01]/)),
    communication_small: _ => prec(-1, token(/[^\n]{43}/)),
    communication_short: _ => prec(-1, token(/[^\n]{53}/)),
    communication: _ => prec(-1, token(/[^\n]{73}/)),
    communication_long: _ => prec(-1, token(/[^\n]{90}/)),
    message: _ => prec(-1, token(/[^\n]{80}/)),
  },
});
