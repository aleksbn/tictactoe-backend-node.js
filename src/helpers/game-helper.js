const { User } = require('../models/user');

// Provjera imamo li pobjednika (funkcija vraca X ako kreator igre pobjedjuje, odnosno O, ako drugi
// igrac pobjedjuje)
// Ovo ce na frontu biti prikazano dinamicki (nekad X, nekad O) kako bi korisnicima bilo zanimljivije
async function checkForWinner(game) {
  const outcome = calculateOutcome(game);

  switch (outcome) {
    case 'X':
      game.winnerId = game.creatorId;
      break;
    case 'O':
      game.winnerId = game.isAgainstPC ? 'PC' : game.opponentId;
      break;
    default:
      break;
  }

  //Ako do sad nismo imali pobjednika, a potrosili smo sve poteze
  if (game.winnerId === undefined && game.moves.length === 9) {
    game.winnerId = 'Draw';
    return {
      status: 200,
      text: "No winner, it's a draw!",
    };
  }
  //Ako je pobjednik upisan u prethodnoj switch statement, a nije remi
  else if (game.winnerId !== undefined && game.winnerId !== 'Draw') {
    const winner =
      game.winnerId === 'PC'
        ? 'PC'
        : (await User.findById(game.winnerId)).nickname;
    console.log(`...and the winner is ${winner}`);
    return {
      status: 200,
      text: `...and the winner is ${winner}`,
    };
  }
  //Ako nije ni remi ni pobjednik, znaci da potez nije odlucio pobjedu i igra nastavlja dalje
  else
    return {
      status: 200,
      text: 'Move played',
    };
}

function pcMove(game) {
  const takenMoves = fillMatrix(game);
  let randomX, randomY;
  while (true) {
    randomX = Math.floor(Math.random() * 3);
    randomY = Math.floor(Math.random() * 3);
    if (takenMoves[randomX][randomY] === '') break;
  }
  return {
    playerId: 'PC',
    xCoord: randomX,
    yCoord: randomY,
  };
}

function printMatrixToConsole(matrix) {
  console.log('Current matrix');
  console.log(matrix[0]);
  console.log(matrix[1]);
  console.log(matrix[2]);
}

function calculateOutcome(game) {
  const matrix = fillMatrix(game);
  printMatrixToConsole(matrix);

  if (game.moves.length < 5) return 'Not done yet';

  //Glavna dijagonala
  if (
    matrix[0][0] !== '' &&
    matrix[0][0] === matrix[1][1] &&
    matrix[1][1] === matrix[2][2]
  )
    return matrix[0][0];

  //Sporedna dijagonala
  if (
    matrix[0][2] !== '' &&
    matrix[0][2] === matrix[1][1] &&
    matrix[1][1] === matrix[2][0]
  )
    return matrix[0][2];

  //Vodoravne varijante pobjednika
  for (let i = 0; i < 3; i++) {
    if (
      matrix[0][i] !== '' &&
      matrix[0][i] === matrix[1][i] &&
      matrix[1][i] === matrix[2][i]
    )
      return matrix[0][i];
  }

  //Uspravne varijante pobjednika
  for (let i = 0; i < 3; i++) {
    if (
      matrix[i][0] !== '' &&
      matrix[i][0] === matrix[i][1] &&
      matrix[i][1] === matrix[i][2]
    )
      return matrix[i][0];
  }

  //Ako jos nema pobjednika
  return 'N';
}

function fillMatrix(game) {
  const matrix = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
  game.moves.forEach((move) => {
    matrix[move.xCoord][move.yCoord] =
      move.playerId === game.creatorId ? 'X' : 'O';
  });
  return matrix;
}

exports.checkForWinner = checkForWinner;
exports.pcMove = pcMove;