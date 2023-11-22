import React from 'react';
import cx from 'classnames';

import { SearchItem } from '../types';

import classNames from './SuggestionsList.module.css'

type SuggestionsListProps = {
  suggestions: SearchItem[];
  highlightedIndex: number | null;
  handleSuggestionClick: (suggestion: SearchItem) => void;
  searchHistory: Set<string>;
  removeFromSearchHistory: (e: React.MouseEvent<HTMLSpanElement>, itemTitle: string) => void;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, highlightedIndex, handleSuggestionClick, searchHistory, removeFromSearchHistory }) => {
  return (
    <ul className={classNames.suggestionList}>
      {suggestions.map((item, index) => {
        const hasItemInHistory = searchHistory.has(item.title);
        return (
          <li
            onMouseDown={(e) => e.preventDefault()}
            className={cx(
              classNames.suggestionItem,
              hasItemInHistory && classNames.suggestionItem__viewed,
              highlightedIndex === index && classNames.suggestionItem__highlighted
            )}
            onClick={() => handleSuggestionClick(item)}
            key={index}
          >
            {item.title}
            {hasItemInHistory && (
              <span
                className={classNames.remove}
                onClick={(e) => removeFromSearchHistory(e, item.title)}
              >
                Remove
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default SuggestionsList;