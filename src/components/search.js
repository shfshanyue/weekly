import React, { useEffect, useRef } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch';
import { useSearchBox, useHits } from 'react-instantsearch';

const searchClient = algoliasearch("JKV7FKXINS", "4e9cbca773c635e6d734768555273e7e");

// Separate SearchBox component using hooks
const SearchBox = ({ onSearchChange }) => {
  const { query, refine } = useSearchBox();
  const [inputValue, setInputValue] = React.useState(query);

  // Sync the query with parent component
  useEffect(() => {
    onSearchChange(query);
  }, [query, onSearchChange]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    // 只在输入法完成输入时更新搜索
    if (e.nativeEvent.isComposing === false) {
      refine(e.target.value);
    }
  };

  const handleCompositionEnd = (e) => {
    refine(e.target.value);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form className="relative" onSubmit={(e) => e.preventDefault()}>
        <input
          className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type="search" 
          value={inputValue}
          onChange={handleChange}
          onCompositionEnd={handleCompositionEnd}
          placeholder="搜索文章..."
        />
        <svg 
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </form>
    </div>
  );
};

// Separate Hits component using hooks
const Hits = () => {
  const { hits } = useHits();
  
  if (hits.length === 0) {
    return (
      <div className="absolute left-0 right-0 mt-1 w-full max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 text-center text-gray-500">
          未找到相关文章
        </div>
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-0 mt-1 w-full max-w-xl mx-auto">
      <ul className="bg-white rounded-lg shadow-lg divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
        {hits.map(hit => (
          <li key={hit.objectID} className="group">
            <a 
              href={hit.fields?.slug || '/'} 
              className="block px-4 py-3 hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  {hit.frontmatter.title}
                </h3>
                {hit.frontmatter.date && (
                  <span className="text-xs text-gray-500">
                    {new Date(hit.frontmatter.date).toLocaleDateString()}
                  </span>
                )}
              </div>
              {hit.frontmatter.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {hit.frontmatter.description}
                </p>
              )}
              {hit.frontmatter.tags && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {hit.frontmatter.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main Search component
const Search = () => {
  const [query, setQuery] = React.useState('');
  const [isVisible, setIsVisible] = React.useState(false);
  const searchRef = React.useRef(null);

  // Handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show results when query exists
  useEffect(() => {
    setIsVisible(!!query);
  }, [query]);

  return (
    <div className="w-full relative h-[42px]" ref={searchRef}>
      <InstantSearch searchClient={searchClient} indexName="weekly">
        <SearchBox onSearchChange={setQuery} />
        {query && isVisible && <Hits />}
      </InstantSearch>
    </div>
  );
};

export default Search;
