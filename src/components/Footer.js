import React from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/Mail";
import InfoIcon from "@mui/icons-material/Info";
import "./Footer.css";

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
  marginLeft: "0.5rem",
  fontSize: "20px",
  cursor: "pointer",
};

const Footer = ({ toggleModal }) => {
  const isMobile = window.innerWidth <= 500;
  const iconSize = isMobile ? "medium" : "default";

  return (
    <footer className="footer">
      <div className="left-links">
        <a
          href="https://twitter.com/visakanv"
          target="_blank"
          style={linkStyle}
        >
          Visa <TwitterIcon className="footer-icon" sx={{ fontSize: "32px" }} />
        </a>
        <a
          href="https://twitter.com/strangestloop"
          target="_blank"
          style={linkStyle}
        >
          Loopy{" "}
          <TwitterIcon className="footer-icon" sx={{ fontSize: "32px" }} />
        </a>
      </div>
      <div className="right-links">
        <a onClick={toggleModal} style={linkStyle}>
          <InfoIcon sx={{ fontSize: "32px" }} />
        </a>
        <a href="https://strangestloop.io" target="_blank" style={linkStyle}>
          <HomeIcon sx={{ fontSize: "32px", px: "10px" }} />
        </a>
        <a href="mailto:loopstrangest@gmail.com" style={linkStyle}>
          <MailIcon sx={{ fontSize: "32px" }} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
