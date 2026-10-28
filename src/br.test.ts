import { describe, expect, it } from 'vitest';
import { cep, cnpj, cpf, detectPersonOrCompany, phone, uf, UF_LIST } from './index';
import type { TDocument, TDocumentIssue } from './index';
import vectors from '../vectors/br.json';

type TVector = { input: string; compact?: string; formatted?: string; reason?: TDocumentIssue; note?: string };

const documents: Record<'cpf' | 'cnpj' | 'cep' | 'phone' | 'uf', TDocument> = { cpf, cnpj, cep, phone, uf };

for (const [name, document] of Object.entries(documents)) {
	describe(`${name} (vetores compartilhados)`, () => {
		for (const v of (vectors as unknown as Record<string, TVector[]>)[name]) {
			const label = `${JSON.stringify(v.input)} → ${v.reason ?? 'válido'}${v.note ? ` (${v.note})` : ''}`;
			it(label, () => {
				const result = document.check(v.input);
				if (v.reason) {
					expect(result).toEqual({ ok: false, reason: v.reason });
					expect(document.isValid(v.input)).toBe(false);
					return;
				}
				expect(result).toEqual({ ok: true, value: v.compact });
				expect(document.isValid(v.input)).toBe(true);
				expect(document.compact(v.input)).toBe(v.compact);
				if (v.formatted) expect(document.format(v.input)).toBe(v.formatted);
			});
		}
	});
}

describe('format de texto incompleto', () => {
	it('devolve o texto como está enquanto não está completo (nunca perde o que foi digitado)', () => {
		expect(cpf.format('529.98')).toBe('529.98');
		expect(cnpj.format('12AB')).toBe('12AB');
		expect(cep.format('0131')).toBe('0131');
		expect(phone.format('(11) 9')).toBe('(11) 9');
	});
});

describe('detectPersonOrCompany', () => {
	for (const v of vectors.detect) {
		it(`${JSON.stringify(v.input)} → ${v.document}`, () => {
			expect(detectPersonOrCompany(v.input)?.id).toBe(v.document ?? undefined);
		});
	}
});

describe('contrato', () => {
	it('toda definição é congelável como dados e tem os 5 membros', () => {
		for (const d of Object.values(documents)) {
			expect(Object.keys(d).sort()).toEqual(['check', 'compact', 'format', 'id', 'isValid']);
		}
	});

	it('UF_LIST tem as 27 unidades federativas, sem repetição', () => {
		expect(UF_LIST).toHaveLength(27);
		expect(new Set(UF_LIST).size).toBe(27);
	});
});

describe('CNPJ: alfanumérico e numérico convivem', () => {
	it('um CNPJ numérico continua válido (A..Z só entram nas 12 primeiras posições)', () => {
		expect(cnpj.isValid('11.222.333/0001-81')).toBe(true);
	});

	it('trocar uma letra por outra muda o dígito esperado', () => {
		expect(cnpj.isValid('12.ABD.345/01DE-35')).toBe(false);
	});
});
