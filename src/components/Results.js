import React, { useState, useCallback, useEffect } from "react";
import essayData from "../data/essay_text";
import "./VisaEssayParser.css";
import { searchVisaEssays as search } from "../utils/searchUtils";
import { makeStyles } from "@mui/styles";

const Results = ({ searchTerm }) => {
  const [results, setResults] = useState([]);
  const [sortDirection, setSortDirection] = useState("oldest");
  const isOldestSelected = sortDirection === "oldest";
  const isNewestSelected = sortDirection === "newest";

  const useStyles = makeStyles(() => ({
    displayButton: {
      flexShrink: 0,
      padding: "5px 10px",
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      cursor: "pointer",
      width: "auto",
      borderRadius: 4,
    },
    displayButtonSelected: {
      flexShrink: 0,
      padding: "5px 10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "1px solid #ccc",
      borderColor: "#007bff",
      cursor: "pointer",
      width: "auto",
      borderRadius: 4,
    },
  }));

  const searchEssays = useCallback((searchTerm) => {
    return search(searchTerm, essayData);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const searchResults = searchEssays(searchTerm);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [searchTerm, searchEssays]);

  const handleSort = (direction) => {
    setSortDirection(direction);
    setResults((prevResults) => {
      const sortedResults = [...prevResults].sort((a, b) =>
        direction === "oldest"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      );
      return sortedResults;
    });
  };

  const classes = useStyles();

  return (
    <>
      <div className="sort">
        <label>Sort order:</label>
        <button
          className={
            isOldestSelected
              ? classes.displayButtonSelected
              : classes.displayButton
          }
          onClick={() => handleSort("oldest")}
        >
          Oldest
        </button>
        <button
          className={
            isNewestSelected
              ? classes.displayButtonSelected
              : classes.displayButton
          }
          onClick={() => handleSort("newest")}
        >
          Newest
        </button>
      </div>
      <p className="result-count">
        {results.length > 0
          ? `${results.length} result${results.length > 1 ? "s" : ""}`
          : searchTerm.length > 0
          ? "No results"
          : ""}
      </p>{" "}
      <div>
        {results.length > 0
          ? results.map((result, i) => (
              <div key={i} className="search-result">
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  <h3
                    className="title"
                    dangerouslySetInnerHTML={{ __html: result.title }}
                  />
                  <p className="date">{result.date}</p>{" "}
                  <div
                    className="excerpt"
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                </a>
              </div>
            ))
          : searchTerm.length > 0}
      </div>
    </>
  );
};
export default Results;
