import { defineDocument, fail, ok } from './document';

const UF_LIST = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'] as const;
type TUf = (typeof UF_LIST)[number];

const compact = (text: string) => text.trim().toUpperCase();

const uf = defineDocument({
	id: 'uf',
	compact,
	format: compact,
	check(text) {
		const value = compact(text);
		if (value === '') return fail('empty');
		return (UF_LIST as readonly string[]).includes(value) ? ok(value) : fail('characters');
	},
});

export { uf, UF_LIST };
export type { TUf };
