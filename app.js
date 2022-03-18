const selectionScreen = document.querySelector('[data-js="selection-screen"]');
const jogoDaVelha = document.querySelector('[data-js="jogo-da-velha"]');
const squares = document.querySelectorAll('[data-js*="square"]');
const rows1 = document.querySelectorAll('[data-js*="1/"]');
const rows2 = document.querySelectorAll('[data-js*="2/"]');
const rows3 = document.querySelectorAll('[data-js*="3/"]');
const cols1 = document.querySelectorAll('[data-js*="/1"]');
const cols2 = document.querySelectorAll('[data-js*="/2"]');
const cols3 = document.querySelectorAll('[data-js*="/3"]');

let player1Turn = false;
let player1Play;

let botTurn = true;
let botPlay;
let botTimeout;

const gameOver = () => {
  if(!player1Turn)
    player1Turn = true
  else if(!botTurn) 
    botTurn = true
  //console.log('deu velha');
  setTimeout(() => {
    squares.forEach(element => {
      const span = element.querySelector('span');
      span.classList.remove('x-color', 'o-color');
      span.textContent = '';
      clearTimeout(botTimeout)
    });
  }, 2300);
};

const checkIfTheSquaresAreFilled = () => {
  const allSquaresFilled = [...squares].filter(element => {
    const span = element.querySelector('span');
    return span.textContent != '';
  });
  
  if(allSquaresFilled.length === 9)
    gameOver();
};

const checkIfXMatchesDiagonalLine = element =>
  element === 'x';

const checkIfOMatchesDiagonalLine = element =>
  element === 'o';

const checkDiagonalLine = (diagonalLine, diagonalLineReverse) => {
  const matchesDiagonalLine = diagonalLine.every(checkIfXMatchesDiagonalLine) ||
                              diagonalLine.every(checkIfOMatchesDiagonalLine);
  const matchesDiagonalLineReverse = diagonalLineReverse.every(checkIfXMatchesDiagonalLine) ||
                                     diagonalLineReverse.every(checkIfOMatchesDiagonalLine);
                                     
  if(matchesDiagonalLine)
    return matchesDiagonalLine;
  
  return matchesDiagonalLineReverse;
};

const filterPlaysOnDiagonalLineReverse = (_, index) => {
  switch(index) {
    case 2:
    case 4:
    case 6:
      return true;
      break;
  };
};

const filterDiagonalLineReverse = currentSquares => {
  const diagonalLineReverse = currentSquares.filter(filterPlaysOnDiagonalLineReverse);
  return diagonalLineReverse;
};

const filterPlaysOnDiagonalLine = (_, index) => {
  switch (index) {
    case 0:
    case 4:
    case 8:
      return true;
      break;
  };
};

const filterDiagonalLine = currentSquares => {
  const diagonalLine = currentSquares.filter(filterPlaysOnDiagonalLine);
  return diagonalLine;
};

const recordPlays = ({ firstElementChild: { textContent }}) => 
  textContent;

const winOnDiagonalLine = play => {
  const currentSquares = [...squares].map(recordPlays);
  const diagonalLine = filterDiagonalLine(currentSquares);
  const diagonalLineReverse = filterDiagonalLineReverse(currentSquares);
 
 
  if(checkDiagonalLine(diagonalLine, diagonalLineReverse))
    return gameOver();
};

const checkWinner = (...plays) => {
  plays.forEach(play => play.length === 3
  ? gameOver()
  : false
  );
  winOnDiagonalLine();
  
};

const checkORow = element => {
  const span = element.querySelector('span');
  return span.textContent === 'o';
};

const checkXRow = element => {
  const span = element.querySelector('span');
  return span.textContent === 'x';
};

const checkX = () => {
  const row1Win = [...rows1].filter(checkXRow);
  const row2Win = [...rows2].filter(checkXRow);
  const row3Win = [...rows3].filter(checkXRow);
  const col1Win = [...cols1].filter(checkXRow);
  const col2Win = [...cols2].filter(checkXRow);
  const col3Win = [...cols3].filter(checkXRow);
  
  checkWinner(row1Win, row2Win, row3Win,
              col1Win, col2Win, col3Win);
};

const checkO = () => {
  const row1Win = [...rows1].filter(checkORow);
  const row2Win = [...rows2].filter(checkORow);
  const row3Win = [...rows3].filter(checkORow);
  const col1Win = [...cols1].filter(checkORow);
  const col2Win = [...cols2].filter(checkORow);
  const col3Win = [...cols3].filter(checkORow);
  
  checkWinner(row1Win, row2Win, row3Win, 
              col1Win, col2Win, col3Win);
};

const checkPlay = ({ textContent }) => ({
  x: checkX,
  o: checkO,
})[textContent]();

const checkPlayerTurn = () => {
  if(player1Turn) {
    player1Turn = false;
    botTurn = true;
    return player1Play;
  };
  
  botTurn = false;
  player1Turn = true;
  return botPlay;
};

const botUpdatePlay = play => {
  play()
}


const botInsertPlay = () => {
  let randomPlay = Math.floor(Math.random() * 9);
  const span = squares[randomPlay].querySelector(`[data-id="${randomPlay}"]`)
  
  if(span.textContent != '') {
    botUpdatePlay(botInsertPlay)
    return
  }
  
  span.textContent = botPlay;
  span.classList.add(`${botPlay}-color`)
  checkPlay(span);
  checkIfTheSquaresAreFilled();
  player1Turn = true
}

const insertPlay = e => {
  if(player1Turn) {
    const span = e.target.firstElementChild;
    
    if (span.textContent != '')
      return;
    
    span.textContent = player1Play;
    
    switch (span.textContent) {
      case 'x':
        span.classList.add('x-color');
        break;
      case 'o':
        span.classList.add('o-color');
        break;
      default:
        '';
    };
    player1Turn = false
    checkPlay(span);
    checkIfTheSquaresAreFilled();
    botTimeout = setTimeout(() => {
      botInsertPlay()
    }, 2300)
    return
  };
};

const startGame = e => {
  const element = e.target.dataset.js;
  const chosenPlay = e.target.innerText.toLowerCase();
  
  const allowedElement = element === 'player-x' || element === 'player-o';
  if(allowedElement) {
    selectionScreen.remove();
    jogoDaVelha.classList.add('visible');
    player1Play = chosenPlay;
    botPlay = (chosenPlay === 'x') ? 'o' : 'x';
    setTimeout(() => {
      botInsertPlay()
    }, 2300)
  };
};

const insertSquareClicks = square => {
  square.addEventListener('click', insertPlay);
};


// EVENTS
squares.forEach(insertSquareClicks);
selectionScreen.addEventListener('click', startGame);
