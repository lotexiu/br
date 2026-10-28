import { cnpj } from './cnpj';
import { cpf } from './cpf';
import type { TDocument } from './types';

const CPF_LENGTH = 11;

/**
 * Escolhe CPF ou CNPJ pelo que foi digitado (o que `getDocumentMask` fazia à mão): só dígitos e até 11 → CPF;
 * qualquer letra, ou mais de 11 caracteres → CNPJ. Texto vazio → `undefined`.
 */
function detectPersonOrCompany(text: string): TDocument | undefined {
	const alphanumeric = text.replace(/[^0-9A-Za-z]/g, '');
	if (alphanumeric === '') return undefined;
	return /^\d+$/.test(alphanumeric) && alphanumeric.length <= CPF_LENGTH ? cpf : cnpj;
}

export { detectPersonOrCompany };
