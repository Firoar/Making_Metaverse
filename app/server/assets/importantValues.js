import fs from "fs";
import { impIndex } from "./importantIndex.js";
export const impValues = {
  raceLeaderBoard: 519,
  jokeARea: 586,
  borderWalls: 568,
  GroupvideoChairs: 537,
  peerVideoChairs: 905,
  quotationARea: 1055,
  ContestLeaderboard: 1050,
  spawnarea: 979,
  contestareamark: 77,
  doorRace: 21,
  doorGroupVideo: 518,
  doorPeerVideo: 543,
  doorContest: 229,
  contestarea: 18,
};

function getMatrixIndex(index, columns = 60) {
  const row = Math.floor(index / columns);
  const column = index % columns;
  return [row, column];
}

export const finalArray = () => {
  const map = new Map();

  let arr = [];
  ///////////////////////////

  let val = impValues.contestarea;
  map.set(val, []);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      map.get(val).push(i);
    }
  }

  console.log(map);

  let finalans = [];

  map.get(val).forEach((ele) => {
    finalans.push(getMatrixIndex(ele, 60));
    console.log(getMatrixIndex(ele, 60));
  });

  console.log(finalans);

  fs.writeFile("array.txt", JSON.stringify(finalans), (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("Data written to array.txt");
    }
  });
};

function createMatrix(rows = 60, cols = 60) {
  const matrix = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(-1);
    }
    matrix.push(row);
  }

  return matrix;
}

function writeFinalMatrix() {
  let matrix = createMatrix();

  for (const key in impIndex) {
    if (impIndex.hasOwnProperty(key)) {
      const arr = impIndex[key];

      for (const item of arr) {
        let row = item[0];
        let col = item[1];

        if (matrix[row][col] == -1) {
          matrix[row][col] = impValues[key];
        } else {
          console.log(
            `There is some other values other than -1 here : ${matrix[row][col]}`
          );
          return;
        }
      }
    }
  }

  fs.writeFile("matrix.txt", JSON.stringify(matrix), (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("Data written to array.txt");
    }
  });
}

writeFinalMatrix();
