/**
 * @file CODA (Coded Statement of Account) grammar
 * @author Floryan Simar floryan.simar@endevops.be
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// ---------------------------------------------------------------------------
// Structured communication layouts (Febelfin CODA v2.8, Annex III)
//
// Movement records carry 3 x 128 positions:
//   2.1 positions  63-115 -> 3 digit type + 50 content
//   2.2 positions  11-63  -> 53 content
//   2.3 positions  83-125 -> 43 content
//
// Information records carry 3 x 128 positions:
//   3.1 positions  41-113 -> 3 digit type + 70 content
//   3.2 positions  11-115 -> 105 content
//   3.3 positions  11-100 -> 90 content
//
// Fields are split when they cross a record boundary so the grammar stays
// line oriented while still naming every documented field.
// ---------------------------------------------------------------------------

const MOVEMENT_CAPACITIES = [50, 53, 43];
const INFORMATION_CAPACITIES = [70, 105, 90];

const AN = 'an';
const NUM = 'num';

const f = (name, len, kind = AN) => ({ name, len, kind });

const STRUCTURED = [
  // ----- Movement records --------------------------------------------------
  {
    kind: 'movement',
    code: '100',
    fields: [f('reference_prefix', 2), f('check_digits', 2, NUM), f('creditor_reference', 21)],
  },
  { kind: 'movement', code: '101', fields: [f('structured_reference', 12, NUM)] },
  { kind: 'movement', code: '102', fields: [f('structured_reference', 12, NUM)] },
  { kind: 'movement', code: '103', fields: [f('identifier', 12, NUM)] },
  {
    kind: 'movement',
    code: '105',
    fields: [
      f('gross_amount_account', 15, NUM),
      f('gross_amount_original', 15, NUM),
      f('rate', 12, NUM),
      f('currency', 3),
      f('structured_reference', 12),
      f('country_code', 2),
      f('amount_eur', 15, NUM),
    ],
  },
  {
    kind: 'movement',
    code: '106',
    fields: [
      f('amount_account', 15, NUM),
      f('basis_amount', 15, NUM),
      f('percentage', 12, NUM),
      f('minimum_flag', 1),
      f('amount_eur', 15, NUM),
    ],
  },
  {
    kind: 'movement',
    code: '108',
    fields: [
      f('amount_account', 15, NUM),
      f('interest_basis', 15, NUM),
      f('interest', 12, NUM),
      f('period', 12, NUM),
    ],
  },
  {
    kind: 'movement',
    code: '111',
    fields: [
      f('card_scheme', 1, NUM),
      f('pos_number', 6),
      f('period_number', 3, NUM),
      f('first_sequence_number', 6, NUM),
      f('first_date', 6, NUM),
      f('last_sequence_number', 6, NUM),
      f('last_date', 6, NUM),
      f('transaction_type', 1, NUM),
      f('terminal_identification', 26),
    ],
  },
  {
    kind: 'movement',
    code: '113',
    fields: [
      f('masked_pan', 16, NUM),
      f('card_scheme', 1, NUM),
      f('terminal_number', 6, NUM),
      f('sequence_number', 6, NUM),
      f('transaction_date', 6, NUM),
      f('transaction_hour', 4, NUM),
      f('transaction_type', 1, NUM),
      f('terminal_identification', 26),
      f('original_amount', 15, NUM),
      f('rate', 12, NUM),
      f('currency', 3),
      f('volume', 5, NUM),
      f('product_code', 2, NUM),
      f('unit_price', 5, NUM),
    ],
  },
  {
    kind: 'movement',
    code: '114',
    fields: [
      f('card_scheme', 1, NUM),
      f('pos_number', 6),
      f('period_number', 3, NUM),
      f('sequence_number', 6, NUM),
      f('transaction_date', 6, NUM),
      f('transaction_hour', 4, NUM),
      f('transaction_type', 1, NUM),
      f('terminal_identification', 26),
      f('transaction_reference', 16),
    ],
  },
  {
    kind: 'movement',
    code: '115',
    fields: [
      f('masked_pan', 16, NUM),
      f('card_scheme', 1, NUM),
      f('terminal_number', 6, NUM),
      f('sequence_number', 6, NUM),
      f('payment_date', 6, NUM),
      f('payment_hour', 4, NUM),
      f('validation_date', 6, NUM),
      f('validation_sequence_number', 6, NUM),
      f('original_amount', 15, NUM),
      f('conformity_code', 1),
      f('terminal_identification', 26),
      f('message', 12),
    ],
  },
  {
    kind: 'movement',
    code: '121',
    fields: [
      f('bill_amount', 15, NUM),
      f('maturity_date', 6, NUM),
      f('conventional_maturity_date', 6, NUM),
      f('issue_date', 6, NUM),
      f('company_number', 11, NUM),
      f('currency', 3),
      f('blanks', 3),
      f('bill_number', 13),
      f('exchange_rate', 12, NUM),
    ],
  },
  {
    kind: 'movement',
    code: '122',
    fields: [
      f('number_of_days', 4, NUM),
      f('interest_rate', 12, NUM),
      f('basis_amount', 15, NUM),
      f('minimum_flag', 1),
      f('bill_number', 13),
      f('maturity_date', 6, NUM),
    ],
  },
  {
    kind: 'movement',
    code: '123',
    fields: [
      f('start_date', 6, NUM),
      f('maturity_date', 6, NUM),
      f('basis_amount', 15, NUM),
      f('percentage', 12, NUM),
      f('term_days', 4, NUM),
      f('minimum_flag', 1),
      f('guarantee_number', 13),
    ],
  },
  {
    kind: 'movement',
    code: '124',
    fields: [
      f('masked_pan', 20),
      f('issuing_institution', 1),
      f('invoice_number', 12),
      f('identification_number', 15),
      f('date', 6),
    ],
  },
  {
    kind: 'movement',
    code: '125',
    fields: [
      f('credit_account_number', 12, NUM),
      f('credit_account_extension', 15),
      f('old_balance', 15, NUM),
      f('new_balance', 15, NUM),
      f('foreign_amount', 15, NUM),
      f('currency', 3),
      f('start_date', 6, NUM),
      f('end_date', 6, NUM),
      f('interest_rate', 12, NUM),
      f('credit_reference', 13),
    ],
  },
  {
    kind: 'movement',
    code: '126',
    fields: [
      f('deposit_number', 15),
      f('deposit_amount', 15, NUM),
      f('account_amount', 15, NUM),
      f('start_date', 6, NUM),
      f('end_date', 6, NUM),
      f('interest_rate', 12, NUM),
      f('interest_amount', 15, NUM),
      f('currency', 3),
      f('rate', 12, NUM),
    ],
  },
  {
    kind: 'movement',
    code: '127',
    fields: [
      f('settlement_date', 6, NUM),
      f('direct_debit_type', 1, NUM),
      f('scheme', 1, NUM),
      f('payment_status', 1, NUM),
      f('creditor_id', 35),
      f('mandate_reference', 35),
      f('message', 62),
      f('r_transaction_type', 1),
      f('reason', 4),
    ],
  },

  // ----- Information records ----------------------------------------------
  {
    kind: 'information',
    code: '001',
    fields: [
      f('counterparty_name', 70),
      f('street', 35),
      f('locality', 35),
      f('identification_code', 35),
    ],
  },
  { kind: 'information', code: '002', fields: [f('communication', 140)] },
  { kind: 'information', code: '004', fields: [f('communication', 140)] },
  { kind: 'information', code: '005', fields: [f('communication', 140)] },
  {
    kind: 'information',
    code: '006',
    fields: [
      f('description', 30),
      f('currency', 3),
      f('amount', 15, NUM),
      f('sign', 1, NUM),
      f('category', 3, NUM),
    ],
  },
  {
    kind: 'information',
    code: '007',
    fields: [
      f('number_of_notes', 7, NUM),
      f('denomination', 6, NUM),
      f('total_amount', 15, NUM),
    ],
  },
  {
    kind: 'information',
    code: '008',
    fields: [f('counterparty_name', 70), f('identification_code', 35)],
  },
  {
    kind: 'information',
    code: '009',
    fields: [f('counterparty_name', 70), f('identification_code', 35)],
  },
  {
    kind: 'information',
    code: '010',
    fields: [
      f('order_number', 13),
      f('securities_file_reference', 15),
      f('customer_reference', 13),
      f('securities_code_type', 2),
      f('security_code', 15),
      f('entry_method', 1),
      f('number', 12, NUM),
      f('issue_currency', 3),
      f('securities_per_unit', 4, NUM),
      f('quotation_currency', 3),
      f('stock_exchange_rate', 12, NUM),
      f('exchange_rate', 12, NUM),
      f('security_name', 40),
      f('bordereau_number', 13),
      f('coupon_attached', 8),
      f('coupon_payment_date', 8, NUM),
      f('market', 30),
      f('purchase_sale_date', 8, NUM),
      f('transaction_nature', 24),
      f('nominal_value', 15, NUM),
    ],
  },
  {
    kind: 'information',
    code: '011',
    fields: [
      f('order_number', 13),
      f('securities_file_reference', 15),
      f('customer_reference', 13),
      f('securities_code_type', 2),
      f('security_code', 15),
      f('number', 12, NUM),
      f('security_name', 40),
      f('issue_currency', 3),
      f('coupon_amount', 14, NUM),
      f('amount_type', 1, NUM),
    ],
  },
];

/**
 * Split a flat field list over the fixed record segments.
 * A field that crosses a boundary yields one piece per segment.
 */
function layout(fields, capacities) {
  const segments = [[]];
  let segment = 0;
  let offset = 0;

  for (let index = 0; index < fields.length; index++) {
    const field = fields[index];
    let remaining = field.len;

    while (remaining > 0) {
      const space = capacities[segment] - offset;
      const take = Math.min(space, remaining);
      segments[segment].push({
        name: field.name,
        len: take,
        kind: field.kind,
      });
      offset += take;
      remaining -= take;

      if (remaining > 0) {
        segment++;
        segments[segment] = [];
        offset = 0;
      }
    }

    if (offset === capacities[segment] && index < fields.length - 1) {
      segment++;
      segments[segment] = [];
      offset = 0;
    }
  }

  // Fill the tail of the last used segment.
  const last = segments[segments.length - 1];
  const used = last.reduce((total, piece) => total + piece.len, 0);
  if (used < capacities[segments.length - 1]) {
    last.push({
      name: 'unused',
      len: capacities[segments.length - 1] - used,
      kind: AN,
      filler: true,
    });
  }

  return segments;
}

const LAYOUTS = STRUCTURED.map((type) => ({
  ...type,
  segments: layout(type.fields, type.kind === 'movement' ? MOVEMENT_CAPACITIES : INFORMATION_CAPACITIES),
}));

// Widths used by generated piece tokens.
const widths = new Set();
for (const type of LAYOUTS) {
  for (const segment of type.segments) {
    for (const piece of segment) {
      widths.add(piece.len);
    }
  }
}

// Every semantic field name needs a node type. Existing rules are reused;
// anything else gets an unreachable alias target.
const existingRules = new Set([
  'record_type',
  'transaction_subtype',
  'information_subtype',
  'application_code',
  'version_code',
  'zeros',
  'blank',
  'seq_number3',
  'seq_number4',
  'detail_number',
  'duplication_flag',
  'account_structure',
  'sign',
  'structured_flag',
  'numeric1',
  'numeric3',
  'numeric4',
  'numeric5',
  'numeric6',
  'numeric15',
  'account_holder_id',
  'date',
  'amount',
  'rate',
  'file_reference',
  'name',
  'customer_reference',
  'account_number',
  'bic',
  'transaction_type',
  'next_code',
  'next_data_record',
  'next_file',
  'reference_number',
  'transaction_code_type',
  'transaction_code_family',
  'transaction_code_operation',
  'transaction_code_category',
  'transaction_reference',
  'structured_communication_type',
  'unstructured_communication_flag',
  'structured_communication_flag',
  'communication_small',
  'communication_short',
  'communication',
  'communication_long',
  'message',
  'rest',
]);

const semanticNames = new Set();
for (const type of LAYOUTS) {
  for (const segment of type.segments) {
    for (const piece of segment) {
      semanticNames.add(piece.name);
    }
  }
}

const phantomRules = {};
for (const name of semanticNames) {
  if (!existingRules.has(name)) {
    phantomRules[name] = () => token(/\u0000/);
  }
}

// ---------------------------------------------------------------------------
// Generated structured communication rules
// ---------------------------------------------------------------------------

/**
 * Wrap a layout piece in a field with the semantic node type of its field.
 * Fixed-width generic tokens are aliased to the semantic rule so a field that
 * spans records can still be highlighted as one logical value.
 */
function piece($, item) {
  const tokenRule = $[item.kind === NUM ? `_num${item.len}` : `_txt${item.len}`];
  if (item.filler) {
    return field('unused', alias(tokenRule, $.unused));
  }
  return field(item.name, alias(tokenRule, $[item.name]));
}

const generated = {};

for (const type of LAYOUTS) {
  const isMovement = type.kind === 'movement';
  const part1 = `${type.kind}_part1_${type.code}`;
  const part2 = `${type.kind}_part2_${type.code}`;
  const part3 = `${type.kind}_part3_${type.code}`;

  generated[part1] = ($) =>
    seq(
      ...(isMovement
        ? movementPart1Prefix(
            $,
            seq(
              field('communication_type', $.structured_communication_flag),
              field('structured_communication_type', alias(type.code, $.structured_communication_type))
            )
          )
        : informationPart1Prefix(
            $,
            seq(
              field('communication_type', $.structured_communication_flag),
              field('structured_communication_type', alias(type.code, $.structured_communication_type))
            )
          )),
      ...type.segments[0].map((item) => piece($, item)),
      ...(isMovement ? movementPart1Suffix($) : informationPart1Suffix($))
    );

  if (type.segments.length >= 2) {
    generated[part2] = ($) =>
      seq(
        ...(isMovement ? movementPart2Prefix($) : informationPart2Prefix($)),
        ...type.segments[1].map((item) => piece($, item)),
        ...(isMovement
          ? movementPart2Suffix($)
          : [field('blank', alias(/ {10}/, $.blank)), ...informationPart2Suffix($)])
      );
  }

  if (type.segments.length >= 3) {
    generated[part3] = ($) =>
      seq(
        ...(isMovement ? movementPart3Prefix($) : informationPart3Prefix($)),
        ...type.segments[2].map((item) => piece($, item)),
        ...(isMovement
          ? movementPart3Suffix($)
          : [field('blank', alias(/ {25}/, $.blank)), ...informationPart3Suffix($)])
      );
  }

  generated[`${type.kind}_${type.code}`] = ($) => {
    const parts = [$[part1]];
    if (type.segments.length >= 2) {
      parts.push($._newline, $[part2]);
    }
    if (type.segments.length >= 3) {
      parts.push($._newline, $[part3]);
    }
    if (parts.length === 1) {
      return parts[0];
    }
    return seq(...parts);
  };
}


module.exports = grammar({
  name: 'coda',

  extras: (_) => [],

  rules: {
    source_file: ($) => repeat(seq($._record, optional($._newline))),

    _newline: (_) => /\r?\n/,

    _record: ($) =>
      choice(
        $.header_record,
        $.old_balance_record,
        ...LAYOUTS.map((type) => $[`${type.kind}_${type.code}`]),
        $.transaction_record_part1,
        $.transaction_record_part2,
        $.transaction_record_part3,
        $.movement_structured_unknown,
        $.information_record_part1,
        $.information_record_part2,
        $.information_record_part3,
        $.information_structured_unknown,
        $.message_record,
        $.new_balance_record,
        $.trailer_record
      ),

    // ------------------------------------------------------------------
    // Header, balances, free communication, trailer
    // ------------------------------------------------------------------
    header_record: ($) =>
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
        field('transaction_reference', $.transaction_reference),
        field('related_reference_or_blank', $.related_reference),
        field('blank', alias(/ {7}/, $.blank)),
        field('version_code', alias('2', $.version_code))
      ),

    old_balance_record: ($) =>
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

    // ------------------------------------------------------------------
    // Unstructured / unknown movement records
    // ------------------------------------------------------------------
    transaction_record_part1: ($) =>
      seq(
        ...movementPart1Prefix($, field('communication_type', $.unstructured_communication_flag)),
        field('communication', $.communication_short),
        ...movementPart1Suffix($)
      ),

    transaction_record_part2: ($) =>
      seq(
        ...movementPart2Prefix($),
        field('communication', $.communication_short),
        ...movementPart2Suffix($)
      ),

    transaction_record_part3: ($) =>
      seq(
        ...movementPart3Prefix($),
        field('communication', $.communication_small),
        ...movementPart3Suffix($)
      ),

    // Fallback for an unknown structured movement type.
    movement_structured_unknown: ($) =>
      seq(
        ...movementPart1Prefix(
          $,
          seq(
            field('communication_type', $.structured_communication_flag),
            field('structured_communication_type', $.structured_communication_type)
          )
        ),
        field('communication', $.communication_short_50),
        ...movementPart1Suffix($)
      ),

    // ------------------------------------------------------------------
    // Unstructured / unknown information records
    // ------------------------------------------------------------------
    information_record_part1: ($) =>
      seq(
        ...informationPart1Prefix($, field('communication_type', $.unstructured_communication_flag)),
        field('communication', $.communication),
        ...informationPart1Suffix($)
      ),

    information_record_part2: ($) =>
      seq(
        ...informationPart2Prefix($),
        field('communication', $.communication_long_105),
        field('blank', alias(/ {10}/, $.blank)),
        ...informationPart2Suffix($)
      ),

    information_record_part3: ($) =>
      seq(
        ...informationPart3Prefix($),
        field('communication', $.communication_long),
        field('blank', alias(/ {25}/, $.blank)),
        ...informationPart3Suffix($)
      ),

    information_structured_unknown: ($) =>
      seq(
        ...informationPart1Prefix(
          $,
          seq(
            field('communication_type', $.structured_communication_flag),
            field('structured_communication_type', $.structured_communication_type)
          )
        ),
        field('communication', $.communication_70),
        ...informationPart1Suffix($)
      ),

    // ------------------------------------------------------------------
    // New balance / free communication / trailer
    // ------------------------------------------------------------------
    message_record: ($) =>
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

    new_balance_record: ($) =>
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

    trailer_record: ($) =>
      seq(
        field('record_type', alias('9', $.record_type)),
        field('blank', alias(/ {15}/, $.blank)),
        field('number_of_record', $.numeric6),
        field('debit_movements', $.numeric15),
        field('credit_movements', $.numeric15),
        field('blank', alias(/ {75}/, $.blank)),
        field('next_file', $.next_file)
      ),

    // ------------------------------------------------------------------
    // Tokens / helpers
    // ------------------------------------------------------------------
    record_type: (_) => prec(-2, token(/\d/)),
    transaction_subtype: (_) => prec(-2, token(/[123]/)),
    information_subtype: (_) => prec(-2, token(/[123]/)),
    application_code: (_) => prec(-1, token(/05/)),
    version_code: (_) => prec(-1, token(/2/)),
    zeros: (_) => prec(-1, token(/0+/)),
    blank: (_) => prec(-1, token(/ +/)),
    structured_communication_type: (_) => prec(-1, token(/\d{3}/)),
    unstructured_communication_flag: (_) => prec(-1, token('0')),
    structured_communication_flag: (_) => prec(-1, token('1')),

    seq_number3: (_) => prec(-1, token(/\d{3}/)),
    seq_number4: (_) => prec(-1, token(/\d{4}/)),
    detail_number: (_) => prec(-1, token(/\d{4}/)),

    duplication_flag: (_) => prec(-1, token(/[D ]/)),
    account_structure: (_) => prec(-1, token(/[0-3]/)),
    sign: (_) => prec(-1, token(/[01]/)),
    structured_flag: (_) => prec(-1, token(/[01]/)),

    numeric1: (_) => prec(-1, token(/\d/)),
    numeric3: (_) => prec(-1, token(/\d{3}/)),
    numeric4: (_) => prec(-1, token(/\d{4}/)),
    numeric5: (_) => prec(-1, token(/\d{5}/)),
    numeric6: (_) => prec(-1, token(/\d{6}/)),
    account_holder_id: (_) => prec(-1, token(/\d{11}/)),
    numeric15: (_) => prec(-1, token(/\d{15}/)),

    date: (_) => token(/\d{6}/),
    amount: (_) => token(/\d{15}/),
    rate: (_) => token(/\d{12}/),

    iso_reason: (_) => prec(-1, token(/[^\n]{4}/)),
    category_purpose: (_) => prec(-1, token(/[^\n]{4}/)),
    purpose: (_) => prec(-1, token(/[^\n]{4}/)),
    file_reference: (_) => prec(-1, token(/[^\n]{10}/)),
    transaction_reference: (_) => prec(-1, token(/[^\n]{16}/)),
    related_reference: (_) => prec(-1, token(/[^\n]{16}/)),
    name: (_) => prec(-1, token(/[^\n]{26}/)),
    customer_reference: (_) => prec(-1, token(/[^\n]{35}/)),
    account_number: (_) => prec(-1, token(/[^\n]{37}/)),
    bic: (_) => prec(-1, token(/[\w ]{8}(?: {3}|[\w]{3})/)),

    transaction_type: (_) => prec(-1, token(/[0-5 ]/)),
    next_code: (_) => prec(-1, token(/[01]/)),
    next_data_record: (_) => prec(-1, token(/[01]/)),
    next_file: (_) => prec(-1, token(/[12]/)),
    reference_number: (_) => prec(-1, token(/[^\n]{21}/)),

    transaction_code_type: (_) => prec(-1, token(/\d/)),
    transaction_code_family: (_) => prec(-1, token(/\d{2}/)),
    transaction_code_operation: (_) => prec(-1, token(/\d{2}/)),
    transaction_code_category: (_) => prec(-1, token(/\d{3}/)),
    transaction_code: ($) =>
      prec(
        -1,
        seq(
          field('type', $.transaction_code_type),
          field('family', $.transaction_code_family),
          field('operation', $.transaction_code_operation),
          field('category', $.transaction_code_category)
        )
      ),

    communication_small: (_) => prec(-1, token(/[^\n]{43}/)),
    communication_short: (_) => prec(-1, token(/[^\n]{53}/)),
    communication_short_50: (_) => prec(-1, token(/[^\n]{50}/)),
    communication_70: (_) => prec(-1, token(/[^\n]{70}/)),
    communication: (_) => prec(-1, token(/[^\n]{73}/)),
    communication_long: (_) => prec(-1, token(/[^\n]{90}/)),
    communication_long_105: (_) => prec(-1, token(/[^\n]{105}/)),
    message: (_) => prec(-1, token(/[^\n]{80}/)),

    // Generated fixed-width tokens used by structured communication pieces.
    ...Object.fromEntries(
      [...widths]
        .sort((a, b) => a - b)
        .flatMap((width) => [
          [`_txt${width}`, (_) => token(new RegExp(`[^\\n]{${width}}`))],
          [`_num${width}`, (_) => token(new RegExp(`[0-9]{${width}}`))],
        ])
    ),

    ...phantomRules,
    ...generated,
  },
});



// ---------------------------------------------------------------------------
// Record prefix / suffix builders
// ---------------------------------------------------------------------------

/**
 * Movement 2.1: 62 positions, communication type, 50 payload, 13 trailer.
 */
function movementPart1Prefix($, communicationType) {
  return [
    field('record_type', alias('2', $.record_type)),
    field('transaction_subtype', alias('1', $.transaction_subtype)),
    field('seq_number', $.seq_number4),
    field('detail_number', $.detail_number),
    field('reference_number', $.reference_number),
    field('movement_sign', $.sign),
    field('amount', $.amount),
    field('value_date', $.date),
    field('transaction_code', $.transaction_code),
    communicationType,
  ];
}

function movementPart1Suffix($) {
  return [
    field('entry_date', $.date),
    field('account_seq', $.numeric3),
    field('globalisation_code', $.numeric1),
    field('next_code', $.next_code),
    field('blank', alias(/ /, $.blank)),
    field('next_data_record', $.next_data_record),
  ];
}

function movementPart2Prefix($) {
  return [
    field('record_type', alias('2', $.record_type)),
    field('transaction_subtype', alias('2', $.transaction_subtype)),
    field('seq_number', $.seq_number4),
    field('detail_number', $.detail_number),
  ];
}

function movementPart2Suffix($) {
  return [
    field('customer_reference', $.customer_reference),
    field('bic_counterparty', $.bic),
    field('blank', alias(/ {3}/, $.blank)),
    field('transaction_type', $.transaction_type),
    field('iso_reason', $.iso_reason),
    field('category_purpose', $.category_purpose),
    field('purpose', $.purpose),
    field('next_code', $.next_code),
    field('blank', alias(/ /, $.blank)),
    field('next_data_record', $.next_data_record),
  ];
}

function movementPart3Prefix($) {
  return [
    field('record_type', alias('2', $.record_type)),
    field('transaction_subtype', alias('3', $.transaction_subtype)),
    field('seq_number', $.seq_number4),
    field('detail_number', $.detail_number),
    field('counter_party_account', $.account_number),
    field('counter_party_name', $.customer_reference),
  ];
}

function movementPart3Suffix($) {
  return [
    field('next_code', $.next_code),
    field('blank', alias(/ /, $.blank)),
    field('next_data_record', $.next_data_record),
  ];
}

/**
 * Information 3.1: 40 positions, communication type, 70 payload, 15 trailer.
 */
function informationPart1Prefix($, communicationType) {
  return [
    field('record_type', alias('3', $.record_type)),
    field('information_subtype', alias('1', $.information_subtype)),
    field('seq_number', $.seq_number4),
    field('detail_number', $.detail_number),
    field('reference_number', $.reference_number),
    field('transaction_code', $.transaction_code),
    communicationType,
  ];
}

function informationPart1Suffix($) {
  return [
    field('blank', alias(/ {12}/, $.blank)),
    field('next_code', $.next_code),
    field('blank', alias(/ /, $.blank)),
    field('next_data_record', $.next_data_record),
  ];
}

function informationPart2Prefix($) {
  return [
    field('record_type', alias('3', $.record_type)),
    field('information_subtype', alias('2', $.information_subtype)),
    field('seq_number', $.seq_number4),
    field('detail_number', $.detail_number),
  ];
}


function informationPart2Suffix($) {
  return [
    field('next_code', $.next_code),
    field('blank', alias(/ /, $.blank)),
    field('next_data_record', $.next_data_record),
  ];
}

function informationPart3Prefix($) {
  return [
    field('record_type', alias('3', $.record_type)),
    field('information_subtype', alias('3', $.information_subtype)),
    field('seq_number', $.seq_number4),
    field('detail_number', $.detail_number),
  ];
}


function informationPart3Suffix($) {
  return [
    field('next_code', $.next_code),
    field('blank', alias(/ /, $.blank)),
    field('next_data_record', $.next_data_record),
  ];
}

module.exports.structured = LAYOUTS;
