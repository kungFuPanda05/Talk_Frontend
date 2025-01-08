import React from "react";
// import "./App.css";

function Typing() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif"}}>
      <div style={{ marginTop: "20px" }}>
        <TypingIndicator />
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={styles.bubble}>
      <div style={styles.dotsContainer}>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}

const styles = {
  bubble: {
    display: "inline-block",
    backgroundColor: '#E0E0E0',
    borderRadius: '15px',
    borderTopLeftRadius: 0,
    borderRadius: "20px",
    marginTop: '5px',
    padding: '20px',
    maxWidth: "200px",
    textAlign: "center",
  },
  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "20px",
  },
};

export default Typing;
