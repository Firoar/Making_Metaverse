import { impIndex } from "./importantIndex.js";
import fs from "fs";

const filepath = "maps.txt";

const generateMap = () => {
  const arr = impIndex.contestareamark;

  arr.forEach((a) => {
    fs.appendFile(filepath, `[JSON.stringify([${a}]), true],\n`, (err) => {
      if (err) {
        console.error("Error appending to the file:", err);
      } else {
      }
    });
  });
};

generateMap();
