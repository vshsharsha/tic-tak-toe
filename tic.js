document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const twoPlayerButton = document.getElementById('twoPlayer');
    const aiButton = document.getElementById('ai');
    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let aiMode = false;
    
    const winningMessage = () => `Player ${currentPlayer} has won!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
    
    const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
    ];
    
    function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    }
    
    function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
    }
    
    function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === '' || b === '' || c === '') {
    continue;
    }
    if (a === b && b === c) {
    roundWon = true;
    break;
    }
    }
    if (roundWon) {
    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    return;
    }
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
    }
    handlePlayerChange();
    }
    function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
    }
    
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
    
    if (aiMode && gameActive && currentPlayer === 'O') {
    aiMove();
    }
    }
    
    function minimax(newGameState, player) {
    const availSpots = newGameState.reduce((acc, curr, idx) => curr === "" ? acc.concat(idx) : acc, []);
    
    if (checkWin(newGameState, 'X')) {
    return { score: -10 };
    } else if (checkWin(newGameState, 'O')) {
    return { score: 10 };
    } else if (availSpots.length === 0) {
    return { score: 0 };
    }
    
    const moves = [];
    
    for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newGameState[availSpots[i]] = player;
    
    if (player === 'O') {
    const result = minimax(newGameState, 'X');
    move.score = result.score;
    } else {
    const result = minimax(newGameState, 'O');
    move.score = result.score;
    }
    
    newGameState[availSpots[i]] = "";
    
    moves.push(move);
    }
    
    let bestMove;
    if (player === 'O') {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
    if (moves[i].score > bestScore) {
    bestScore = moves[i].score;
    bestMove = moves[i];
    }
    }
    } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
    if (moves[i].score < bestScore) {
    bestScore = moves[i].score;
    bestMove = moves[i];
    }
    }
    }
    
    return bestMove;
    }
    
    function aiMove() {
    const bestSpot = minimax(gameState, 'O').index;
    const cell = document.querySelector(`.cell[data-index='${bestSpot}']`);
    
    handleCellPlayed(cell, bestSpot);
    handleResultValidation();
    }
    
    function checkWin(board, player) {
    return winningConditions.some(condition => {
    return condition.every(index => {
    return board[index] === player;
    });
    });
    }
    
    function handleResetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => cell.innerHTML = "");
    }
    
    function setTwoPlayerMode() {
    aiMode = false;
    handleResetGame();
    }
    
    function setAIMode() {
    aiMode = true;
    handleResetGame();
    }
    
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', handleResetGame);
    twoPlayerButton.addEventListener('click', setTwoPlayerMode);
    aiButton.addEventListener('click', setAIMode);
    
    statusDisplay.innerHTML = currentPlayerTurn();
    });
               
    




