import { defineDocument, fail, group, ok, onlyDigits } from './document';

/** Códigos de área (DDD) em uso — Anatel (mesma lista do javaValidationsBR). */
const AREA_CODES: ReadonlySet<string> = new Set(
	[
		11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82,
		83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
	].map(String)
);

const COUNTRY_CODE = '55';
const LANDLINE = 10;
const MOBILE = 11;
const WITH_COUNTRY_LANDLINE = 12;
const WITH_COUNTRY_MOBILE = 13;

/** Separa o `55` (se presente e coerente com o tamanho) do número nacional. */
function split(digits: string): { country: boolean; national: string } {
	const hasCountry = (digits.length === WITH_COUNTRY_LANDLINE || digits.length === WITH_COUNTRY_MOBILE) && digits.startsWith(COUNTRY_CODE);
	return { country: hasCountry, national: hasCountry ? digits.slice(COUNTRY_CODE.length) : digits };
}

const phone = defineDocument({
	id: 'phone-br',
	compact: onlyDigits,
	format(text) {
		const { country, national } = split(onlyDigits(text));
		if (national.length !== LANDLINE && national.length !== MOBILE) return text;
		const middle = national.length === MOBILE ? 5 : 4;
		const body = `(${national.slice(0, 2)}) ${group(national.slice(2), [middle, 4], ['-'])}`;
		return country ? `+${COUNTRY_CODE} ${body}` : body;
	},
	check(text) {
		const digits = onlyDigits(text);
		if (digits === '') return fail('empty');
		const { national } = split(digits);
		if (national.length !== LANDLINE && national.length !== MOBILE) return fail('length');
		return AREA_CODES.has(national.slice(0, 2)) ? ok(digits) : fail('area-code');
	},
});

export { phone, AREA_CODES };
