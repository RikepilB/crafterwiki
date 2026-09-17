import { tokenize } from '../../../cli/query.mjs';

// Search only tests token membership/prefixes; repeated prose adds bytes, not information.
export function browserCorpus(corpus) {
  return {
    taxonomy: { placement_status: corpus.taxonomy.placement_status.map(({ id, rank_weight, counts_as_winner }) => ({ id, rank_weight, counts_as_winner })) },
    items: corpus.items.map(({ text, ...item }) => ({ ...item, text: [...new Set(tokenize(text))].join(' ') })),
  };
}
