export const testingStyle = {
  backgroundColor: "green",
};

export const gridStyle = {
  1: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto", // ensures it centers vertically
    marginBottom: "auto", // ensures it centers vertically
  },
  2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 480px)", // 2 columns with 48px width
    gap: "0",
    marginTop: "auto",
    marginBottom: "auto", // centers the grid vertically
    justifyContent: "center", // ensures grid is centered horizontally
  },
  3: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 480px)", // First row with 2 columns
    gap: "0",
    marginTop: "auto",
    marginBottom: "auto", // centers the grid vertically
    justifyContent: "center", // ensures grid is centered horizontally
    gridTemplateRows: "auto", // adjusts the row height automatically
  },
  4: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 480px) 480px", // 2 columns in the first row, 1 column in the second row
    gap: "0",
    marginTop: "auto",
    marginBottom: "auto", // centers the grid vertically
    justifyContent: "center", // ensures grid is centered horizontally
    gridTemplateRows: "auto auto", // 2 rows
  },
};

export const displayGrid = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
  maxHeight: "740px",
  overflowY: "auto",
};

export const hideScrollBar = (mainDiv) => {
  mainDiv.style.scrollbarWidth = "none";
  mainDiv.style.msOverflowStyle = "none";
  mainDiv.style.overflow = "hidden";
};

export const nameSpanCss = {
  position: "absolute",
  bottom: "5px",
  left: "235px",
  color: "silver",
  fontWeight: 700,
};

export const videoDivCss = {
  backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`, // Dynamic color
  width: "480px",
  height: "360px",
  position: "relative",
};

export const videoEleCss = {
  width: "100%",
  height: "100%",
};
