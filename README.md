# @lotexiu/br

> **Pacote opcional e de região.** Regras que dependem de país **não** pertencem ao núcleo agnóstico (`@lotexiu/typescript`), por isso moram aqui. É um caso de uso do motor genérico e um conjunto de vetores de teste — **sem prioridade** e sem nenhuma dependência de volta: pode ser movido para outro repositório, congelado ou descartado sem afetar o núcleo.

Documentos e formatos do Brasil como **dados** sobre [`@lotexiu/typescript`](../typescript) (`ChecksumUtils`): o motor fica no núcleo; as regras do país, aqui.

```ts
import { cpf, cnpj, cep, phone, uf, detectPersonOrCompany } from '@lotexiu/br'

cnpj.check('12.ABC.345/01DE-35')   // { ok: true, value: '12ABC34501DE35' }   (CNPJ alfanumérico)
cnpj.format('12abc34501de35')       // '12.ABC.345/01DE-35'
cpf.check('529.982.247-26')        // { ok: false, reason: 'check-digit' }
phone.format('+55 11 98765-4321')   // '+55 (11) 98765-4321'
detectPersonOrCompany('12A')?.id    // 'cnpj'  (só dígitos e ≤ 11 → cpf)
```

Todo documento segue o mesmo contrato (o do `python-stdnum`): `compact` · `format` · `check` (valor **ou motivo**, nunca lança) · `isValid`.

| Documento | Regra |
|---|---|
| `cpf` | 11 dígitos, mód. 11 (2 dígitos), rejeita todos iguais |
| `cnpj` | 14 posições (12 alfanuméricas A–Z/0–9 + 2 dígitos), mód. 11 com valor = ASCII − 48 (numérico e alfanumérico convivem), rejeita todos iguais |
| `cep` | 8 dígitos |
| `phone` | 10/11 dígitos (com ou sem `+55`), DDD na lista da Anatel |
| `uf` | as 27 UFs |

Vetores de teste em `vectors/br.json` — compartilháveis com o `javaValidationsBR` (Kotlin) e uma futura versão Rust. Diferenças deliberadas em relação a ele estão marcadas com `note` nos vetores (CNPJ só de zeros é recusado; telefone exige DDD).

Fora de escopo por ora: inscrição estadual por UF (27 estados). Se um dia for feita, será **aqui** (ou em outro pacote de região), nunca no núcleo.
