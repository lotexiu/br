import type { TDocument, TDocumentCheck, TDocumentDefinition, TDocumentIssue } from './types';

const ok = (value: string): TDocumentCheck => ({ ok: true, value });
const fail = (reason: TDocumentIssue): TDocumentCheck => ({ ok: false, reason });

/** Completa a definição com `isValid`. */
function defineDocument(definition: TDocumentDefinition): TDocument {
	return { ...definition, isValid: (text) => definition.check(text).ok };
}

/** Agrupa `text` em pedaços de tamanhos fixos, intercalando separadores: `group('12345678901', [3,3,3,2], ['.', '.', '-'])`. */
function group(text: string, sizes: readonly number[], separators: readonly string[]): string {
	let result = '';
	let at = 0;
	sizes.forEach((size, index) => {
		result += text.slice(at, at + size);
		at += size;
		if (index < separators.length) result += separators[index];
	});
	return result;
}

const onlyDigits = (text: string) => text.replace(/\D/g, '');
const onlyAlphanumeric = (text: string) => text.replace(/[^0-9A-Za-z]/g, '');

export { ok, fail, defineDocument, group, onlyDigits, onlyAlphanumeric };
