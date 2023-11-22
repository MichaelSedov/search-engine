import React, { useState, ChangeEvent, useCallback } from 'react';
import cx from 'classnames';

import SearchResults from './SearchResults/SerchResults';
import SuggestionsList from './SuggestionsList/SuggestionsList';
import useAutocomplete from './hooks/useAutocomplete';

import { localDB } from './mockDB'
import { SearchItem, SearchResult } from './types';
import SearchIcon from './assets/icons/SearchIcon.svg';
import CloseIcon from './assets/icons/CloseIcon.svg';

import classNames from './Search.module.css'

const Search: React.FC = () => {
  const { inputValue, setInputValue, suggestions, setSuggestions, handleAutocomplete } = useAutocomplete('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<Set<string>>(new Set());

  const shouldRenderSuggestions = suggestions.length > 0 && isFocused

  const handleBlur = () => {
    setIsFocused(false)
  };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    handleAutocomplete(inputValue);
  }, [inputValue, handleAutocomplete]);

  const handleSearch = useCallback((searchTerm: string) => {
    const startTime = performance.now();
    const results = localDB.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const endTime = performance.now();

    setSearchResults({
      items: results,
      count: results.length,
      timeTaken: endTime - startTime
    });
    setSearchHistory(prevHistory => new Set(prevHistory).add(searchTerm));
  }, []);

  const handleSuggestionClick = useCallback((suggestion: SearchItem) => {
    setInputValue(suggestion.title);
    handleSearch(suggestion.title);
    setSuggestions([]);
  }, [handleSearch, setInputValue, setSuggestions]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    handleAutocomplete(e.target.value);
  }, [handleAutocomplete, setInputValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();

      setHighlightedIndex(prevIndex =>
        prevIndex === null || prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();

      setHighlightedIndex(prevIndex =>
        prevIndex === null || prevIndex === 0 ? null : prevIndex - 1
      );
    } else if (e.key === 'Enter') {
      const selectedSuggestion = highlightedIndex !== null ? suggestions[highlightedIndex] : null;
      if (selectedSuggestion) {
        setInputValue(selectedSuggestion.title);
        handleSearch(selectedSuggestion.title);
      }
      else if (!!inputValue) {
        handleSearch(inputValue);
      }

      setSuggestions([]);
      setHighlightedIndex(null);
    }
  }

  const clearInput = () => {
    setInputValue('')
  }

  const removeFromSearchHistory = (e: any, itemTitle: string) => {
    e.stopPropagation()
    setSearchHistory(prevHistory => {
      const newHistory = new Set(prevHistory);
      newHistory.delete(itemTitle);
      return newHistory;
    });
  };

  return (
    <>
      <div className={classNames.search}>
        <div
          className={cx(
            classNames.inputControl,
            shouldRenderSuggestions && classNames.inputControl__active
          )}
        >
          <img alt='Search icon' className={classNames.searchIcon} src={SearchIcon} width={16} height={16} />
          <input
            className={classNames.input}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoFocus
          />
          {!!inputValue && (
            <div
              tabIndex={0}
              aria-label='Clear'
              className={classNames.closeIcon}
              role='button'
              onClick={clearInput}
              onKeyDown={clearInput}
            >
              <img alt='Clear icon' src={CloseIcon} width={16} height={16} />
            </div>
          )}
        </div>

        {shouldRenderSuggestions && (
          <SuggestionsList
            suggestions={suggestions}
            highlightedIndex={highlightedIndex}
            handleSuggestionClick={handleSuggestionClick}
            searchHistory={searchHistory}
            removeFromSearchHistory={removeFromSearchHistory}
          />
        )}
      </div>

      {searchResults && <SearchResults results={searchResults} />}
    </>
  );
};

export default Search;