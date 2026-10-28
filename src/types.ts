/** Por que um documento foi recusado. Erro como valor (nunca lança): quem chama decide a mensagem e o idioma. */
type TDocumentIssue = 'empty' | 'length' | 'characters' | 'repeated' | 'check-digit' | 'area-code';

type TDocumentCheck = { readonly ok: true; readonly value: string } | { readonly ok: false; readonly reason: TDocumentIssue };

/**
 * Contrato único de todo documento (o mesmo do `python-stdnum`):
 * - `compact`  forma canônica, sem validar (tira pontuação/espaços)
 * - `format`   forma de exibição; texto que ainda não está completo volta como está
 * - `check`    valida e devolve o valor compacto **ou o motivo**
 * - `isValid`  atalho booleano de `check`
 */
type TDocument = Readonly<{
	id: string;
	compact(text: string): string;
	format(text: string): string;
	check(text: string): TDocumentCheck;
	isValid(text: string): boolean;
}>;

type TDocumentDefinition = Omit<TDocument, 'isValid'>;

export type { TDocumentIssue, TDocumentCheck, TDocument, TDocumentDefinition };
