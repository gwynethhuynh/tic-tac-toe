/** This modules stores information about the game board. */
const GameBoard = (() => {
    const _board = [['', '', ''], ['', '', ''], ['', '', '']];

    /**
     * Updates board to have player game piece at a specified title
     * @param {*} row row number of board from 0 to 3
     * @param {*} column column number of board from 0 to 3
     * @param {*} player the player who changes the board
     */
    const updateBoard = (row, column, gamePiece) => {
        _board[row][column] = gamePiece;
    };

    /**
     * Resets board to be empty
     */
    const resetBoard = () => {
        for (let r = 0; r < _board.length; r++) {
            for (let c = 0; c < _board[0].length; c++) {
                _board[r][c] = '';
            }
        }
    }

    const getBoard = () => {
        const board = JSON.parse(JSON.stringify(_board)); //Deep copy
        return board;
    }
    
    return {
        updateBoard,
        resetBoard,
        getBoard
    };
})();

// Factory: creating multiple players
const Player = (gamePiece) => {
    const _gamePiece = gamePiece;
    const getGamePiece = () => {
        return _gamePiece;
    }

    return {
        getGamePiece,
    };

}

// Factory
const GameLogic = (board, player1, player2) => {
    let currPlayer = player1;
    let winner = 'nobody';

    const checkValidPlay = (row, column) => {
        const tile = board.getBoard()[row][column];
        return tile === '';
    }

    const play = (row, column) => {
        const gamePiece = currPlayer.getGamePiece();
        if (checkValidPlay(row, column)) {
            board.updateBoard(row, column, gamePiece);
            DisplayController.renderPiece(row, column, board);
            if (checkGameOver(row, column)) {
                winner = currPlayer.getGamePiece()
                console.log(`Game over ${winner} wins!`);
                DisplayController.displayWinner(currPlayer);
                //TODO: display winner;
            } else if (checkTie()) {
                console.log("Tie!");
                DisplayController.displayTie();
            } else {
                switchPlayer();
                DisplayController.renderCurrPlayer(currPlayer);
            }
        } else {
            console.log('Error');
            //TODO: display error message 
        }
    }
    const checkGameOver = (row, column) => {
        const currBoard = board.getBoard();
        const tile = currBoard[row][column];
        if (checkColWin(currBoard, tile, column)) {
            return true;
        }
        if (checkRowWin(currBoard, tile, row)) {
            return true;
        }
        if (checkDiagonalWin(currBoard, tile)) {
            return true;
        }
        return false;
    };
    
    const checkColWin = (currBoard, tile, column) => {
        let win = true;
        for (let r = 0; r < currBoard.length; r++) {
            if (!(tile === currBoard[r][column])) {
                win = false;
            }
        }
        return win;   
    };

    const checkRowWin = (currBoard, tile, row) => {
        let win = true;
        for (let c = 0; c < currBoard[0].length; c++) {
            if (!(tile === currBoard[row][c])) {
                win = false;
            }
        }
        return win;
    };

    const checkDiagonalWin = (currBoard, tile) => {
        let win1 = true;
        for (let r = 0; r < currBoard.length; r++) {
            if (!(tile === currBoard[r][r])) {
                win1 = false;
            }
        }
        let win2 = true;
        for (let r = 0; r < currBoard.length; r++) {
            if (!(tile === currBoard[r][currBoard.length - 1 - r])) {
                win2 = false;
            }
        }
        return win1 || win2;
    };

    // Check tie if board is filled
    const checkTie = () => { 
        const currBoard = board.getBoard();
        for (let r = 0; r < currBoard.length; r++) {
            for (let c = 0; c < currBoard[0].length; c++) {
                if (currBoard[r][c] === '') {
                    return false;
                }
            }
        }
        return true;
    };

    const switchPlayer = () => {
        if (currPlayer === player1) {
            currPlayer = player2;
        } else {
            currPlayer = player1;
        }
    };
    return {
        play
    };
};

// Module: one Display Board
const DisplayController = (() => {
    const player1 = Player("X");
    const player2 = Player("O");
    const logic = GameLogic(GameBoard, player1, player2);
    
    const displayWinner = (currPlayer) => {
        let gameOver = document.getElementsByClassName("gameOver")[0];
        gameOver.innerHTML = `Player ${currPlayer.getGamePiece()} has won! Refresh to play again.`;
        currPlayerDisplay = document.getElementById("playerTurn");
        currPlayerDisplay.textContent = '';
    };

    const displayTie = () => {
        let gameOver = document.getElementsByClassName("gameOver")[0];
        gameOver.innerHTML = `It's a Tie! Refresh to play again.`;
        currPlayerDisplay = document.getElementById("playerTurn");
        currPlayerDisplay.textContent = '';
    };

    const setup = () => {
        
    };

    const renderPiece = (row, col, board) => {
        let gamePiece = board.getBoard()[row][col];
        let grid = document.getElementsByClassName("square");
        let square = grid[row * 3 + col];
        square.innerHTML = `<span>${gamePiece}</span>`;
    }

    const renderCurrPlayer = (player) => {
        currPlayerDisplay = document.getElementById("playerTurn");
        currPlayerDisplay.textContent = `Player ${player.getGamePiece()}'s Turn!`;
    }

    const attachButtons = () => {
        grid = document.getElementsByClassName("square");
        for (let i = 0; i < grid.length; i++) {
            square = grid[i];
            square.addEventListener('click', () => {
                let row =  Math.floor(i / 3);
                let col = i % 3;
				console.log([i, Math.floor(i / 3), i % 3]);
                logic.play(row, col);
                console.log(GameBoard.getBoard());
			});
        }
    }

    const renderBoard = () => {

    };

    return {
        attachButtons,
        renderPiece,
        renderCurrPlayer,
        displayTie,
        displayWinner,
    };
})();






function simulate() {
    GameBoard.resetBoard();
    const player1 = Player("Mary");
    const player2 = Player("John");
    const logic = GameLogic(GameBoard, player1, player2);
    logic.play(0,0);
    logic.play(1,0);
    logic.play(2,0);
    logic.play(1,1);
    logic.play(0,1);
    logic.play(2,1);
    logic.play(1,2);
    logic.play(0,2);
    logic.play(2,2);
}

DisplayController.attachButtons()
// simulate()