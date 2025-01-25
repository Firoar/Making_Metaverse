export const testingStyle = {
  backgroundColor: "green",
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

export const fullScreenCss = {
  width: "100%",
  height: "100%",
};

export const videoEleCss = {
  width: "100%",
  height: "100%",
};
