global.grammar = (x) => x;
const fs = require('fs');
const path = require('path');
const g = require(path.join(__dirname, '..', 'grammar.js'));

const P = {
  'keyword.directive': '#f5c2e7',
  comment: '#9399b2',
  constant: '#fab387',
  string: '#a6e3a1',
  'string.special': '#f5c2e7',
  'string.special.symbol': '#f2cdcd',
  character: '#94e2d5',
  type: '#f9e2af',
  'type.builtin': '#cba6f7',
  operator: '#89dceb',
  label: '#74c7ec',
  function: '#89b4fa',
  variable: '#cdd6f4',
  'variable.parameter': '#eba0ac',
  'variable.member': '#b4befe',
  error: '#f38ba8',
};
const CAPS = Object.keys(P).filter(c => !['comment','keyword.directive','error'].includes(c));

const FIXED = {
  record_type_0: 'keyword.directive',
  record_type_1: 'type',
  record_type_2: 'function',
  record_type_3: 'label',
  record_type_4: 'variable.parameter',
  record_type_8: 'character',
  record_type_9: 'constant',
  transaction_subtype_1: 'variable.member',
  transaction_subtype_2: 'variable.parameter',
  transaction_subtype_3: 'string.special.symbol',
  information_subtype_1: 'variable.member',
  information_subtype_2: 'variable.parameter',
  information_subtype_3: 'string.special.symbol',
  blank: 'comment',
  unused: 'comment',
  zeros: 'comment',
  unstructured_communication_flag: 'operator',
  structured_communication_flag: 'operator',
  structured_communication_type: 'type.builtin',
  transaction_code_type: 'constant',
  transaction_code_family: 'type',
  transaction_code_operation: 'function',
  transaction_code_category: 'type.builtin',
};

const PREF = {};
const setPref = (names, cap) => names.forEach(n => PREF[n]=cap);
setPref(['amount','amount_account','amount_eur','basis_amount','bill_amount','total_amount','deposit_amount','account_amount','interest_amount','foreign_amount','gross_amount_account','gross_amount_original','original_amount','old_balance','new_balance','nominal_value','coupon_amount','unit_price','rate','exchange_rate','interest_rate','percentage','stock_exchange_rate','interest','interest_basis','volume','number_of_record','debit_movements','credit_movements'], 'constant');
setPref(['date','transaction_date','payment_date','validation_date','first_date','last_date','settlement_date','start_date','end_date','maturity_date','conventional_maturity_date','issue_date','coupon_payment_date','purchase_sale_date','period','transaction_reference'], 'character');
setPref(['name','counterparty_name','security_name','street','locality','market','transaction_nature','terminal_identification','communication','communication_70','communication_short','communication_short_50','communication_small','communication_long','communication_long_105','message','description','purpose'], 'string');
setPref(['file_reference','customer_reference','account_number','reference_number','structured_reference','creditor_reference','reference_prefix','identification_code','identification_number','invoice_number','mandate_reference','creditor_id','order_number','bill_number','guarantee_number','bordereau_number','credit_reference','securities_file_reference','security_code','securities_code_type','company_number','credit_account_number','credit_account_extension','deposit_number','pos_number','terminal_number','country_code','iso_reason','category_purpose','related_reference','transaction_reference'], 'string.special');
setPref(['bic','currency','issue_currency','quotation_currency','issuing_institution','conformity_code','r_transaction_type','reason'], 'string.special.symbol');
setPref(['seq_number3','seq_number4','detail_number','numeric1','numeric3','numeric5','numeric6','numeric15','application_code','version_code','separate_application_code','number','securities_per_unit','amount_type','number_of_notes','denomination','number_of_days','term_days','coupon_attached','sequence_number','first_sequence_number','last_sequence_number','validation_sequence_number','period_number','transaction_hour','payment_hour','product_code'], 'label');
setPref(['sign','duplication_flag','transaction_type','next_code','next_data_record','next_file','account_structure','minimum_flag','direct_debit_type','scheme','payment_status'], 'operator');
setPref(['account_holder_id'], 'variable.parameter');
setPref(['card_scheme','entry_method'], 'variable.member');
setPref(['masked_pan'], 'type');

const TX = [
  ['type','transaction_code_type'],
  ['family','transaction_code_family'],
  ['operation','transaction_code_operation'],
  ['category','transaction_code_category'],
];

const MOV_PRE = [
  ['record_type','record_type_2'],
  ['transaction_subtype','transaction_subtype_1'],
  ['seq_number','seq_number4'],
  ['detail_number','detail_number'],
  ['reference_number','reference_number'],
  ['movement_sign','sign'],
  ['amount','amount'],
  ['value_date','date'],
];
const MOV_TAIL = [
  ['entry_date','date'],
  ['account_seq','numeric3'],
  ['globalisation_code','numeric1'],
  ['next_code','next_code'],
  ['blank','blank'],
  ['next_data_record','next_data_record'],
];
const MOV2_PRE = [
  ['record_type','record_type_2'],
  ['transaction_subtype','transaction_subtype_2'],
  ['seq_number','seq_number4'],
  ['detail_number','detail_number'],
];
const MOV2_TAIL = [
  ['customer_reference','customer_reference'],
  ['bic_counterparty','bic'],
  ['blank','blank'],
  ['transaction_type','transaction_type'],
  ['iso_reason','iso_reason'],
  ['category_purpose','category_purpose'],
  ['purpose','purpose'],
  ['next_code','next_code'],
  ['blank','blank'],
  ['next_data_record','next_data_record'],
];
const MOV3_PRE = [
  ['record_type','record_type_2'],
  ['transaction_subtype','transaction_subtype_3'],
  ['seq_number','seq_number4'],
  ['detail_number','detail_number'],
  ['counter_party_account','account_number'],
  ['counter_party_name','customer_reference'],
];
const MOV3_TAIL = [
  ['next_code','next_code'],
  ['blank','blank'],
  ['next_data_record','next_data_record'],
];
const INFO_PRE = [
  ['record_type','record_type_3'],
  ['information_subtype','information_subtype_1'],
  ['seq_number','seq_number4'],
  ['detail_number','detail_number'],
  ['reference_number','reference_number'],
];
const INFO_TAIL = [
  ['blank','blank'],
  ['next_code','next_code'],
  ['blank','blank'],
  ['next_data_record','next_data_record'],
];
const INFO2_PRE = [
  ['record_type','record_type_3'],
  ['information_subtype','information_subtype_2'],
  ['seq_number','seq_number4'],
  ['detail_number','detail_number'],
];
const INFO3_PRE = [
  ['record_type','record_type_3'],
  ['information_subtype','information_subtype_3'],
  ['seq_number','seq_number4'],
  ['detail_number','detail_number'],
];

const seqs = [];
seqs.push(['header_record', [
  ['record_type','record_type_0'],['zeros','zeros'],['creation_date','date'],['seq_number','seq_number3'],['application_code','application_code'],['duplication_flag','duplication_flag'],['blank','blank'],['file_reference_or_blank','file_reference'],['addressee_name','name'],['bic','bic'],['account_holder_id','account_holder_id'],['blank','blank'],['separate_application_code','numeric5'],['transaction_reference','transaction_reference'],['related_reference_or_blank','related_reference'],['blank','blank'],['version_code','version_code'],
]]);
seqs.push(['old_balance_record', [
  ['record_type','record_type_1'],['account_structure','account_structure'],['seq_number','seq_number3'],['account_number_and_currency','account_number'],['sign','sign'],['amount','amount'],['date','date'],['account_holder_name','name'],['account_description','customer_reference'],['coded_statement_sequence_or_zeros','seq_number3'],
]]);
seqs.push(['transaction_record_part1', [...MOV_PRE,['communication_type','unstructured_communication_flag'],['communication','communication_short'],...MOV_TAIL]]);
seqs.push(['transaction_record_part2', [...MOV2_PRE,['communication','communication_short'],...MOV2_TAIL]]);
seqs.push(['transaction_record_part3', [...MOV3_PRE,['communication','communication_small'],...MOV3_TAIL]]);
seqs.push(['information_record_part1', [...INFO_PRE,['communication_type','unstructured_communication_flag'],['communication','communication'],...INFO_TAIL]]);
seqs.push(['information_record_part2', [...INFO2_PRE,['communication','communication_long_105'],...INFO_TAIL]]);
seqs.push(['information_record_part3', [...INFO3_PRE,['communication','communication_long'],...INFO_TAIL]]);
seqs.push(['message_record', [
  ['record_type','record_type_4'],['blank','blank'],['seq_number','seq_number4'],['detail_number','detail_number'],['blank','blank'],['message','message'],['blank','blank'],['next_data_record','next_data_record'],
]]);
seqs.push(['new_balance_record', [
  ['record_type','record_type_8'],['seq_number','seq_number3'],['account_number','account_number'],['sign','sign'],['new_balance','amount'],['new_balance_date','date'],['blank','blank'],['next_data_record','next_data_record'],
]]);
seqs.push(['trailer_record', [
  ['record_type','record_type_9'],['blank','blank'],['number_of_record','numeric6'],['debit_movements','numeric15'],['credit_movements','numeric15'],['blank','blank'],['next_file','next_file'],
]]);

const payload = (t,i) => (t.segments[i]||[]).map(p => p.filler ? ['unused','unused'] : [p.name,p.name]);
const withTx = (pre) => [...pre, ...TX];

for (const t of g.structured) {
  const isM = t.kind === 'movement';
  const pre1 = isM ? withTx(MOV_PRE) : withTx(INFO_PRE);
  const tail1 = isM ? MOV_TAIL : INFO_TAIL;
  seqs.push([`${t.kind}_part1_${t.code}`, [...pre1,['communication_type','structured_communication_flag'],['structured_communication_type','structured_communication_type'],...payload(t,0),...tail1]]);
  if (t.segments.length >= 2) {
    const pre2 = isM ? MOV2_PRE : INFO2_PRE;
    const tail2 = isM ? MOV2_TAIL : INFO_TAIL;
    seqs.push([`${t.kind}_part2_${t.code}`, [...pre2,...payload(t,1),...tail2]]);
  }
  if (t.segments.length >= 3) {
    const pre3 = isM ? MOV3_PRE : INFO3_PRE;
    const tail3 = isM ? MOV3_TAIL : INFO_TAIL;
    seqs.push([`${t.kind}_part3_${t.code}`, [...pre3,...payload(t,2),...tail3]]);
  }
}
seqs.push(['movement_structured_unknown', [...withTx(MOV_PRE),['communication_type','structured_communication_flag'],['structured_communication_type','structured_communication_type'],['communication','communication_short_50'],...MOV_TAIL]]);
seqs.push(['information_structured_unknown', [...withTx(INFO_PRE),['communication_type','structured_communication_flag'],['structured_communication_type','structured_communication_type'],['communication','communication_70'],...INFO_TAIL]]);

// Resolve colours per sequence occurrence.
const out = new Map(); // "parent\0field\0node" -> cap
const advice = [];
for (const [parent, slots] of seqs) {
  let prevCap = null;
  for (let i=0; i<slots.length; i++) {
    const [field, node] = slots[i];
    let cap = FIXED[node] || PREF[node] || 'string';
    // Avoid same colour as previous slot.
    const avoid = new Set();
    if (prevCap) avoid.add(P[prevCap]);
    // Avoid next fixed slot's colour.
    if (i+1 < slots.length) {
      const nextNode = slots[i+1][1];
      if (FIXED[nextNode]) avoid.add(P[FIXED[nextNode]]);
    }
    if (avoid.has(P[cap])) {
      cap = CAPS.find(c => !avoid.has(P[c]));
    }
    prevCap = cap;
    if (!FIXED[node]) {
      const key = `${parent}\0${field}\0${node}`;
      out.set(key, cap);
    }
    // report adjacency of two non-padding fields with same colour
    if (i>0) {
      const [pf,pn] = slots[i-1];
      const pcap = FIXED[pn] || out.get(`${parent}\0${pf}\0${pn}`);
      if (P[pcap] === P[cap] && !(pcap==='comment' && cap==='comment')) {
        advice.push(`${parent}: ${pf}(${pcap}) -> ${field}(${cap})`);
      }
    }
  }
}

console.log('ADVICE', advice.length ? advice.join('\n') : 'none');

// Emit query lines.
const lines = [];
const emit = (s='') => lines.push(s);
emit('; CODA (Coded Statement of Account) highlights');
emit('; Generated from grammar.js. Each record kind gets a distinct colour on');
emit('; every field, and adjacent fields never share the same colour.');
emit('');
emit('; ---------------------------------------------------------------------------');
emit('; Record classes');
emit('; ---------------------------------------------------------------------------');
for (const [digit, cap] of [['0','keyword.directive'],['1','type'],['2','function'],['3','label'],['4','variable.parameter'],['8','character'],['9','constant']]) {
  emit(`((record_type) @${cap} (#eq? @${cap} "${digit}"))`);
}
emit('');
emit('; Article codes');
emit('((transaction_subtype) @variable.member (#eq? @variable.member "1"))');
emit('((transaction_subtype) @variable.parameter (#eq? @variable.parameter "2"))');
emit('((transaction_subtype) @string.special.symbol (#eq? @string.special.symbol "3"))');
emit('((information_subtype) @variable.member (#eq? @variable.member "1"))');
emit('((information_subtype) @variable.parameter (#eq? @variable.parameter "2"))');
emit('((information_subtype) @string.special.symbol (#eq? @string.special.symbol "3"))');
emit('');
emit('; Fixed structural values');
emit('(unstructured_communication_flag) @operator');
emit('(structured_communication_flag) @operator');
emit('(structured_communication_type) @type.builtin');
emit('(zeros) @comment');
emit('(blank) @comment');
emit('(unused) @comment');
emit('');
emit('; Transaction code');
emit('(transaction_code_type) @constant');
emit('(transaction_code_family) @type');
emit('(transaction_code_operation) @function');
emit('(transaction_code_category) @type.builtin');
emit('');
emit('; Record fields');
for (const [parent, slots] of seqs) {
  emit(`; ${parent}`);
  for (const [field, node] of slots) {
    if (FIXED[node]) continue;
    const cap = out.get(`${parent}\0${field}\0${node}`);
    if (!cap) continue;
    emit(`(${parent} ${field}: (${node}) @${cap})`);
  }
  emit('');
}
emit('(ERROR) @error');
fs.writeFileSync(path.join(__dirname, '..', 'queries', 'coda', 'highlights.scm'), lines.join('\n') + '\n');
console.log('lines', lines.length);
