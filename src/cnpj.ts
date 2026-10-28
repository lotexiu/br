import { ChecksumUtils } from '@lotexiu/typescript';
import type { TWeightedSpec } from '@lotexiu/typescript';
import { defineDocument, fail, group, ok, onlyAlphanumeric } from './document';

const CNPJ_LENGTH = 14;
const BASE_LENGTH = 12;
/** 12 primeiras posições: letras A-Z ou dígitos; as 2 últimas (dígitos verificadores) são sempre numéricas. */
const SHAPE = /^[A-Z0-9]{12}\d{2}$/;

// Alfanumérico desde jul/2026: valor de cada caractere = código ASCII − 48 (A=17...) e o mesmo módulo 11 dos CNPJs numéricos
// (que continuam válidos: '0'..'9' valem 0..9 nessa conta).
const mod11 = (weights: readonly number[]): TWeightedSpec => ({ weights, modulus: 11, rule: 'complement-zero-below-2', charValue: 'ascii-48' });
const FIRST_DIGIT = mod11([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
const SECOND_DIGIT = mod11([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

const compact = (text: string) => onlyAlphanumeric(text).toUpperCase();

const cnpj = defineDocument({
	id: 'cnpj',
	compact,
	format(text) {
		const value = compact(text);
		return value.length === CNPJ_LENGTH ? group(value, [2, 3, 3, 4, 2], ['.', '.', '/', '-']) : text;
	},
	check(text) {
		const value = compact(text);
		if (value === '') return fail('empty');
		if (value.length !== CNPJ_LENGTH) return fail('length');
		if (!SHAPE.test(value)) return fail('characters');
		// todos iguais (ex.: 00000000000000) fecham a conta do módulo 11, mas não são CNPJ — o javaValidationsBR aceita; aqui é recusado
		if (ChecksumUtils.allSame(value)) return fail('repeated');
		const base = value.slice(0, BASE_LENGTH);
		const first = ChecksumUtils.digit(base, FIRST_DIGIT);
		const second = ChecksumUtils.digit(base + first, SECOND_DIGIT);
		return value.endsWith(`${first}${second}`) ? ok(value) : fail('check-digit');
	},
});

export { cnpj };
