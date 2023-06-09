import React from "react";
import { Box, Modal, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  modal: {
    backgroundColor: "#333",
    color: "#fff",
    margin: 16,
    borderRadius: 8,
    maxWidth: 600,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: 0,
    right: 0,
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "32px",
    textAlign: "center",
  },
}));

const SearchModal = ({ open, onClose }) => {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className={classes.modal}
        sx={{ display: "flex", flexDirection: "column", mx: "auto" }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Search Definitions
        </Typography>
        <Typography className={classes.text}>
          <strong>long game:</strong> "long" and "game"
        </Typography>
        <Typography className={classes.text}>
          <strong>long or game:</strong> "long" and/or "game"
        </Typography>
        <Typography className={classes.text}>
          <strong>"long game":</strong> the phrase "long game"
        </Typography>
        <Typography className={classes.text}>
          <strong>playing or "long game":</strong> "playing" and/or the phrase
          "long game"
        </Typography>
      </Box>
    </Modal>
  );
};

export default SearchModal;
