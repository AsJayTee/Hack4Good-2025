import React, { useState } from 'react';
import './Search.css';  // Your styles

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  // Function to handle changes to the search input
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  // Function to handle search submit
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(query);  // Pass the search query to the parent component
  };

  // Optional: Function to handle 'Enter' key press explicitly
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit(event);  // Trigger the search on 'Enter'
    }
  };

  return (
    <form action="#" className="search" onSubmit={handleSearchSubmit}>
      <div className="input-group">
        <input
          id="search"
          name="search"
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={query}
          onChange={handleSearchChange}  // Update the search query
          onKeyDown={handleKeyPress}  // Optionally listen for "Enter" key press
          required
        />
        {/* Search Button */}
        <button
          className="btn"
          type="submit"
          aria-label="Search"
          disabled={!query} // Disable button if query is empty
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default Search;
