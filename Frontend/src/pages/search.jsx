import React, { useState } from "react";
import "../styles/search.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("❌ Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h2 className="search-title">🔍 Search</h2>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter search term..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && <p className="loading-msg">Searching...</p>}

        <div className="results-list">
          {results.length === 0 && !loading ? (
            <p className="empty-msg">No results found. Try another search! 🙂</p>
          ) : (
            results.map((item) => (
              <div key={item.id} className="result-card">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}