import { useState } from 'react';
import { localDB } from '../mockDB';
import { SearchItem } from '../types';

const useAutocomplete = (initialInputValue: string) => {
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);

  const handleAutocomplete = (input: string) => {
    if (input.length === 0) {
      setSuggestions([]);
      return;
    }
    const filteredSuggestions = localDB.filter(item =>
      item.title.toLowerCase().startsWith(input.toLowerCase())
    ).slice(0, 10);

    setSuggestions(filteredSuggestions);
  };

  return { inputValue, setInputValue, suggestions, setSuggestions, handleAutocomplete };
};

export default useAutocomplete;