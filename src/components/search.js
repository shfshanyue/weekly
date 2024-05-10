import React, { useEffect, useRef } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { autocomplete } from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';
import { InstantSearch } from 'react-instantsearch';

const searchClient = algoliasearch("KEHAN28C4G", "b175dd119a8d07a48390bd30dd8e1e49");

const AutocompleteComponent = ({ onSearchChange }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const autocompleteInstance = autocomplete({
      container: containerRef.current,
      onStateChange: ({ state }) => {
        onSearchChange(state.query);
      },
      getSources: () => [
        {
          sourceId: 'data-autocomplete-source-id',
          getItems: ({ query }) => {
            if (query.length === 0) {
              return [];
            }
            return searchClient
              .initIndex('weekly')
              .search(query, { hitsPerPage: 8 })
              .then((res) => res.hits.map(hit => ({
                ...hit,
                label: hit.title,
              })));
          },
          templates: {
            item: (tpl) => {
              return tpl.html`
              <a target="_blank" href=${tpl.item?.link || '/'}>${tpl.item.title}</a>
            `
            },
          },
        },
      ],
    });

    return () => {
      autocompleteInstance.destroy();
    };
  }, [onSearchChange]);

  return <div ref={containerRef} />;
};

const Search = () => {
  const [query, setQuery] = React.useState('');

  return (
    <InstantSearch searchClient={searchClient} indexName="weekly">
      <AutocompleteComponent onSearchChange={setQuery} />
    </InstantSearch>
  );
};

export default Search;
