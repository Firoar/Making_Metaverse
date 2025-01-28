import { generate } from "random-words";

let GAMEOVER = false;
const CANVASWIDTH = 700;
const CANVASHEIGHT = 796;
let YSPEED = 1;
let LIVES = 5;

const giveMeAWord = () => {
  const randomNum = Math.floor(Math.random() * 3) + 1;
  let randomWord;

  switch (randomNum) {
    case 1:
      randomWord = generate({ maxLength: 14, minLength: 10, exactly: 1 });
      break;
    case 2:
      randomWord = generate({
        wordsPerString: 2,
        separator: " ",
        exactly: 1,
        minLength: 5,
        maxLength: 6,
      });
      break;
    case 3:
      randomWord = generate({
        wordsPerString: 2,
        separator: "-",
        exactly: 1,
        minLength: 5,
        maxLength: 6,
      });
      break;
  }
  return randomWord[0];
};

export const startGamefn = () => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      gameLogic();
    });
  } else {
    gameLogic();
  }
};

class Shooter {
  constructor() {
    this.width = 100;
    this.height = 50;
    this.position = {
      x: CANVASWIDTH / 2 - this.width / 2, // 350-50=300
      y: CANVASHEIGHT - this.height, // 746
    };
    this.text = "Shooter";
  }
  draw(c) {
    c.strokeStyle = "black";
    c.lineWidth = 2;
    c.strokeRect(this.position.x, this.position.y, this.width, this.height);

    c.fillStyle = "black";
    c.textAlign = "center";
    c.font = "20px Arial";
    c.textBaseline = "middle";
    c.fillText(
      this.text,
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
  }
  update(c) {
    this.draw(c);
  }
}

class Bullet {
  constructor(velX, velY) {
    this.height = 10;
    this.width = 5;
    this.position = {
      x: CANVASWIDTH / 2 - this.width / 2,
      y: CANVASHEIGHT - shooter.height,
    };
    this.velocity = {
      x: velX,
      y: velY,
    };
  }
  draw(c) {
    c.fillStyle = "brown";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update(c) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw(c);

    if (
      this.position.x < 0 ||
      this.position.x > CANVASWIDTH ||
      this.position.y < 0 ||
      this.position.y > CANVASHEIGHT
    ) {
      const index = bullets.indexOf(this);
      if (index > -1) {
        bullets.splice(index, 1);
      }
    }
  }
}

class WordBlock {
  constructor(posX, posY, velX, velY, text = "raama") {
    this.width = 140;
    this.height = 50;
    this.position = {
      x: posX,
      y: posY,
    };
    this.velocity = {
      x: velX,
      y: velY,
    };
    this.text = text;
    this.textLength = this.text.length;
    this.currInd = 0;
  }
  draw(c) {
    const a = this.text.slice(0, this.currInd);
    const b = this.text.slice(this.currInd);
    c.strokeStyle = "black";
    c.lineWidth = 2;
    c.strokeRect(this.position.x, this.position.y, this.width, this.height);

    c.textAlign = "left";
    c.font = "20px Arial";
    c.textBaseline = "middle";
    c.fillStyle = "green";
    c.fillText(a, this.position.x + 10, this.position.y + this.height / 2);

    c.fillStyle = "black";
    c.fillText(
      b,
      this.position.x + 10 + c.measureText(a).width,
      this.position.y + this.height / 2
    );
  }
  update(c) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.draw(c);
  }
}
const shooter = new Shooter();
const bullets = [];
const wordBlocks = [];

const pushOneNewWord = () => {
  const ind = [-1, 0, 1, 2, 3, 4, 5];
  let i = ind[Math.floor(Math.random() * 7)];

  wordBlocks.push(
    new WordBlock(
      i * 140,
      0,
      (280 - i * 140) / (700 / YSPEED),
      YSPEED,
      giveMeAWord()
    )
  );
};

const currentLetter = () => {
  if (wordBlocks.length.length <= 0) return;
  const word = wordBlocks[0];
  return word.text[word.currInd];
};
const increaseInd = () => {
  const word = wordBlocks[0];
  word.currInd++;
  if (word.currInd >= word.textLength) {
    bullets.push(new Bullet(-word.velocity.x, -word.velocity.y * 10));
  }
};

const gameLogic = () => {
  const mainGameArea = document.querySelector(".gameArea-main");
  const canvas = mainGameArea.querySelector("canvas");

  canvas.width = CANVASWIDTH;
  canvas.height = CANVASHEIGHT;

  const c = canvas.getContext("2d");
  animate(c);

  setInterval(() => {
    pushOneNewWord();
  }, 3000);

  addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      GAMEOVER = true;
    } else if (wordBlocks.length && event.key === currentLetter()) {
      increaseInd();
    }
  });
};

const detectBulletWordBlockClash = () => {
  if (bullets.length <= 0 || wordBlocks.length <= 0) return;
  const bullet = bullets[0];
  const wordBlock = wordBlocks[0];

  if (bullet.position.y <= wordBlock.position.y + wordBlock.height) {
    bullets.shift();
    wordBlocks.shift();
  }
};

const detectWordBlockShooterClash = () => {
  if (wordBlocks.length <= 0) return;
  const wordBlock = wordBlocks[0];

  if (wordBlock.position.y >= shooter.position.y - shooter.height) {
    wordBlocks.splice(0, 2);
    LIVES -= 1;
    console.log(LIVES);
  }
};

const animate = (c) => {
  if (GAMEOVER) return;
  requestAnimationFrame(() => animate(c));
  c.fillStyle = "white";
  c.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  shooter.update(c);
  for (let bullet of bullets) {
    bullet.update(c);
  }
  for (let wordBlock of wordBlocks) {
    wordBlock.update(c);
  }
  detectBulletWordBlockClash();
  detectWordBlockShooterClash();

  if (LIVES < 0) {
    GAMEOVER = true;
  }
};
