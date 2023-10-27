let turnos=true 
let roomId = -1
let client = -1

    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    console.log("hola")
    /*
        Indexes within the board
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

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

    /*
    socket.on('joinRoom', (room) => {
        roomId = room;
    });
    */


    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

    if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

    if (!board.includes(''))
        announce(TIE);
    }

    const announce = (type) => {
        switch(type){
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O'){
            return false;
        }

        return true;
    };

    const updateBoard =  (index) => {
        board[index] = currentPlayer;
    }

  
    function userAction(tile, index) {
        if (turnos=true){
            if (isValidAction(tile) && isGameActive) {
                tile.innerText = currentPlayer;
                tile.classList.add(`player${currentPlayer}`);
                turnos=false
                updateBoard(index);
                handleResultValidation();
                socket.emit('makeMove', { index: index, roomId: roomId, });
                if(currentPlayer==='X'){
                    currentPlayer='O'
                }else{
                    currentPlayer='X'
                }
                
        }
        }else{ /*
            if (isValidAction(tile) && isGameActive) {
                tile.innerText = currentPlayer;
                tile.classList.add(`player${currentPlayer}`);
                turnos=false
                updateBoard(index);
                handleResultValidation();
                socket.emit('makeMove', { index: index, roomId: roomId });
                if(currentPlayer==='X'){
                    currentPlayer='O'
                }else{
                    currentPlayer='X'
                }
                }
            */}
        }
    
        resetButton.addEventListener('click', () => {
        resetBoard();

        socket.emit('resetGame');
    });

    
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    tiles.forEach( (tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', () => {
        resetBoard();

        socket.emit('resetGame');
    });

    socket.on("connect", () => {
        console.log("Me conecte al socket");
        console.log(turnos)
        
    });

    socket.on('unirseSala', (data) => {

            roomId = data.sala
            
            console.log(data)
            if (data.client == 1) {
                client = 'X'
            } else {
                client = 'O'
            }

        console.log("Room: ", roomId)
    });
    socket.on('mensaje', (data) => {
        
       
    });

    socket.on('opponentMove', (data) => {
        if (data.room === roomId) {
            const tile = tiles[data.index];
            if (isValidAction(tile)) {
                tile.innerText = currentPlayer === 'X' ? 'O' : 'X';
                tile.classList.add(`player${currentPlayer === 'X' ? 'O' : 'X'}`);
                updateBoard(data.index);
                handleResultValidation();
            }
        }
    });

    socket.on('makeMove', (data) => {
        const { index, room } = data;
    
        const game = gameRooms[room];
        const { board, currentPlayer } = game;
        if (data.currentPlayer==currentPlayer) {
            turnos=true
            if (isValidMove(board, index, currentPlayer)) {
                board[index] = currentPlayer;
                const roundGanada = checkWin(board, currentPlayer);
        
                if (roundGanada) {
                    io.to(room).emit('gameOver', { result: currentPlayer === 'X' ? 'PLAYERX_WON' : 'PLAYERO_WON' });
                    game.isGameActive = false;
                } else if (!board.includes('')) {
                    io.to(room).emit('gameOver', { result: 'TIE' });
                    game.isGameActive = false;
                } else {
                    game.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    io.to(room).emit('opponentMove', { index, currentPlayer: game.currentPlayer });
                }
            }
        }
            
    });
    
    
    
    
    
    




