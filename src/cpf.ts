import { ChecksumUtils } from '@lotexiu/typescript';
import type { TWeightedSpec } from '@lotexiu/typescript';
import { defineDocument, fail, group, ok, onlyDigits } from './document';

const CPF_LENGTH = 11;
const BASE_LENGTH = 9;
const mod11 = (weights: readonly number[]): TWeightedSpec => ({ weights, modulus: 11, rule: 'complement-zero-below-2' });
const FIRST_DIGIT = mod11([10, 9, 8, 7, 6, 5, 4, 3, 2]);
const SECOND_DIGIT = mod11([11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

const cpf = defineDocument({
	id: 'cpf',
	compact: onlyDigits,
	format(text) {
		const digits = onlyDigits(text);
		return digits.length === CPF_LENGTH ? group(digits, [3, 3, 3, 2], ['.', '.', '-']) : text;
	},
	check(text) {
		const digits = onlyDigits(text);
		if (digits === '') return fail('empty');
		if (digits.length !== CPF_LENGTH) return fail('length');
		if (ChecksumUtils.allSame(digits)) return fail('repeated');
		const base = digits.slice(0, BASE_LENGTH);
		const first = ChecksumUtils.digit(base, FIRST_DIGIT);
		const second = ChecksumUtils.digit(base + first, SECOND_DIGIT);
		return digits.endsWith(`${first}${second}`) ? ok(digits) : fail('check-digit');
	},
});

export { cpf };
