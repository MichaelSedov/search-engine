import { SearchResult } from '../types';

import classNames from './SearchResults.module.css'

type SearchResultsProps = {
  results: SearchResult
}

const SearchResults = ({ results }: SearchResultsProps) => {
  return (
    <div className={classNames.results}>
      <div className={classNames.meta}>
        Found {results.count} results in {results.timeTaken.toFixed(2)} milliseconds
      </div>
      <ul className={classNames.searchResultsList}>
        {results.items.map((item, index) => (
          <li key={index}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
};

export default SearchResults;