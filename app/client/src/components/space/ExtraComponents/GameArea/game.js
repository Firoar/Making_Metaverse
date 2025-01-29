import { generate } from "random-words";

let GAMEOVER = false;
const CANVASWIDTH = 700;
const CANVASHEIGHT = 796;
let YSPEED = 1;
let SCORE = 0;

const giveMeImage = (src) => {
  const img = new Image();
  img.src = src;
  img.onload = () => {};
  img.onerror = () => {
    console.error(`Failed to load image: ${src}`);
  };
  return img;
};

const Aestroid1 = giveMeImage("./aestroid-1-jod.png");
const Aestroid2 = giveMeImage("./aestroid-2-jod.png");
const Aestroid3 = giveMeImage("./aestroid-3-jod.png");
const Galaxy = giveMeImage("./galaxy.jpg");
const SpaceShip = giveMeImage("./spaceship.png");
const Missle = giveMeImage("./missle.png");
const Explosion = giveMeImage("./explosion.png");
const Heart = giveMeImage("./heart.png");

const giveMeRandomAestroidImage = () => {
  const randomNum = Math.floor(Math.random() * 3) + 1;
  switch (randomNum) {
    case 1:
      return Aestroid1;
    case 2:
      return Aestroid2;
    case 3:
      return Aestroid3;
  }
};

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
    this.height = 100;
    this.position = {
      x: CANVASWIDTH / 2 - this.width / 2, // 350-50=300
      y: CANVASHEIGHT - this.height, // 746
    };
    this.text = "Shooter";
  }
  draw(c) {
    c.drawImage(
      SpaceShip,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update(c) {
    this.draw(c);
  }
}

class Blast {
  constructor(posX, posY) {
    this.position = {
      x: posX,
      y: posY,
    };
    this.countDown = 0;
    this.image = Explosion;
  }
  draw(c) {
    c.drawImage(this.image, this.position.x, this.position.y, 50, 50);
  }
  update(c) {
    this.draw(c);
  }
}

class Bullet {
  constructor(velX, velY) {
    this.height = 30;
    this.width = 30;
    this.position = {
      x: CANVASWIDTH / 2 - this.width / 2,
      y: CANVASHEIGHT - shooter.height,
    };
    this.velocity = {
      x: velX,
      y: velY,
    };
    this.image = Missle;
  }
  draw(c) {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update(c) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw(c);
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
    this.image = giveMeRandomAestroidImage();
    this.text = text;
    this.textLength = this.text.length;
    this.currInd = 0;
  }
  draw(c) {
    const a = this.text.slice(0, this.currInd);
    const b = this.text.slice(this.currInd);

    c.drawImage(this.image, this.position.x, this.position.y, 140, 50);

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
class Lives {
  constructor() {
    this.width = 80;
    this.height = 80;
    this.position = {
      x: 20,
      y: CANVASHEIGHT - this.height - 30,
    };
    this.lives = 5;
    this.image = Heart;
  }
  draw(c) {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.font = "20px Arial";
    c.fillStyle = "white";
    c.fillText(
      this.lives,
      this.position.x + 35,
      this.position.y + 10 + this.height
    );
  }
  update(c) {
    this.draw(c);
  }
}
const shooter = new Shooter();
const LIVES = new Lives();
const bullets = [];
const wordBlocks = [];
let blasts = [];

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
    bullets.push(new Bullet(-word.velocity.x * 10, -word.velocity.y * 10));
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

const drawGameOverBoard = (c) => {
  c.fillStyle = "white";
  c.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  c.drawImage(Galaxy, 0, 0, CANVASWIDTH, CANVASHEIGHT);
  c.font = "50px Arial";
  c.fillStyle = "red";
  c.fillText(`GAME OVER`, CANVASWIDTH / 2 - 150, CANVASHEIGHT / 2 - 150);

  c.font = "30px Arial";
  c.fillStyle = "white";
  c.fillText(`Score : ${SCORE}`, CANVASWIDTH / 2 - 100, CANVASHEIGHT / 2 - 100);
};

const detectBulletWordBlockClash = () => {
  if (bullets.length <= 0 || wordBlocks.length <= 0) return;
  const bullet = bullets[0];
  const wordBlock = wordBlocks[0];

  if (bullet.position.y <= wordBlock.position.y + wordBlock.height) {
    blasts.push(new Blast(wordBlock.position.x + 40, wordBlock.position.y));
    bullets.shift();
    SCORE += wordBlocks[0].text.length;
    wordBlocks.shift();
  }
};

const drawScoreBoard = (c) => {
  c.font = "20px Arial";
  c.fillStyle = "white";
  c.fillText(`Score : ${SCORE}`, CANVASWIDTH - 150, CANVASHEIGHT - 20);
};

const detectWordBlockShooterClash = () => {
  if (wordBlocks.length <= 0) return;
  const wordBlock = wordBlocks[0];

  if (wordBlock.position.y >= shooter.position.y) {
    blasts.push(
      new Blast(wordBlocks[0].position.x + 40, wordBlocks[0].position.y)
    );
    SCORE -= wordBlocks[0].text.length;
    blasts.push(
      new Blast(wordBlocks[1].position.x + 30, wordBlocks[1].position.y)
    );
    SCORE -= wordBlocks[1].text.length;
    wordBlocks.splice(0, 2);
    LIVES.lives -= 1;
  }
};

const animate = (c) => {
  if (GAMEOVER) {
    drawGameOverBoard(c);
    return;
  }
  requestAnimationFrame(() => animate(c));
  c.fillStyle = "white";
  c.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
  c.drawImage(Galaxy, 0, 0, CANVASWIDTH, CANVASHEIGHT);
  shooter.update(c);
  LIVES.update(c);
  drawScoreBoard(c);
  for (let bullet of bullets) {
    bullet.update(c);
  }
  for (let wordBlock of wordBlocks) {
    wordBlock.update(c);
  }
  for (let blast of blasts) {
    blast.update(c);
    blast.countDown += 1;
  }
  blasts = blasts.filter((blast) => blast.countDown < 20);
  detectBulletWordBlockClash();
  detectWordBlockShooterClash();

  if (LIVES.lives <= 0) {
    GAMEOVER = true;
  }
};
