import React, { useState, useCallback, useEffect } from "react";
import essayData from "../data/essay_text";
import "./VisaEssayParser.css";
import { searchVisaEssays as search } from "../utils/searchUtils";
import Footer from "./Footer";
import Results from "./Results";
import SearchModal from "./SearchModal";
import { makeStyles } from "@mui/styles";

const VisaEssayParser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [displayMode, setDisplayMode] = useState("results");

  const useStyles = makeStyles(() => ({
    searchContainer: {
      display: "flex",
      position: "relative",
      margin: "auto",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      maxWidth: 450,
    },
    formContainer: {
      width: 325,
      position: "relative",
    },
    infoIcon: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      right: 32,
    },
    infoWrapper: {
      cursor: "pointer",
    },
    displayMode: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "auto",
      marginTop: 10,
      marginBottom: 10,
      padding: 0,
      flexWrap: "wrap",
      gap: 10,
    },
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
    sortButton: {
      flexShrink: 0,
      padding: "5px 10px",
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      cursor: "pointer",
      width: "auto",
      borderRadius: 4,
    },
    sortButtonSelected: {
      backgroundColor: "#007bff",
      color: "#fff",
      borderColor: "#007bff",
    },
  }));

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const classes = useStyles();

  return (
    <div>
      <h1>Visa Essay Parser</h1>
      {/*
      <div className={classes.displayMode}>
        <button
          className={`sort-button ${
            displayMode === "results" ? "selected" : ""
          } ${
            displayMode === "results"
              ? classes.displayButtonSelected
              : classes.displayButton
          }`}
          onClick={() => setDisplayMode("results")}
        >
          Results
        </button>
        <button
          className={`sort-button ${
            displayMode === "stats" ? "selected" : ""
          } ${
            displayMode === "stats"
              ? classes.displayButtonSelected
              : classes.displayButton
          }`}
          onClick={() => setDisplayMode("stats")}
        >
          Stats
        </button>
      </div>
        */}
      <div className={classes.searchContainer}>
        <div className={classes.formWrapper}>
          <form className={classes.formContainer}>
            <input
              type="text"
              placeholder="Search for a word or phrase"
              value={searchTerm}
              onChange={handleChange}
            />
          </form>
        </div>
        <div className={classes.infoWrapper}>
          {showModal && <SearchModal open={showModal} onClose={toggleModal} />}
        </div>
      </div>
      <div className="content-box">
        {displayMode === "results" ? (
          <Results searchTerm={searchTerm} />
        ) : (
          <div>
            <p>Stats will be displayed here.</p>
          </div>
        )}
      </div>
      <Footer toggleModal={toggleModal} />
    </div>
  );
};

export default VisaEssayParser;
