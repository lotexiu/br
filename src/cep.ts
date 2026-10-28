import { defineDocument, fail, group, ok, onlyDigits } from './document';

const CEP_LENGTH = 8;

const cep = defineDocument({
	id: 'cep',
	compact: onlyDigits,
	format(text) {
		const digits = onlyDigits(text);
		return digits.length === CEP_LENGTH ? group(digits, [5, 3], ['-']) : text;
	},
	check(text) {
		const digits = onlyDigits(text);
		if (digits === '') return fail('empty');
		return digits.length === CEP_LENGTH ? ok(digits) : fail('length');
	},
});

export { cep };
