function createPlayer(name,marker){
    return{name,marker,cells:[]}
}
playerX = createPlayer("Player X", "x");
playerO = createPlayer("Player O", "o");

const renderUI = (function (){
    const gameBoardDiv = document.querySelector(".game-board");
    const customPointer = document.querySelector(".custom-pointer");
    const form = document.querySelector("form");
    const xInput = document.querySelector("#x-player");
    const oInput = document.querySelector("#o-player");
    const saveBtn = document.querySelector("#save-btn");
    let touchDevice = false;
    const announcement = document.querySelector(".announcement");

    function announceWinner(roundWinner,winCells,board){
        form.style.display = "flex";
        announcement.textContent = roundWinner == "tie" ? "IT'S A TIE"
        :  "🎉 " + roundWinner.name.toUpperCase() + " WINS 🎉";
        if(winCells){
            winCells.forEach((cell)=>{
                cellDiv = document.getElementById(cell);
                cellDiv.classList.add("winner-cell");
            })
        }
        renderBoard(roundWinner,roundWinner,board)
    }
    function renderBoard(activePlayer,roundWinner,board){
        board.forEach((cell,index) => { 
            cellDiv = document.getElementById(`${index}`)
            cellDiv.textContent = cell;
            cellDiv.style.color = cell == "x" ? "white" : "firebrick";
            if(!roundWinner){
                form.style.display = "none";
                announcement.textContent = activePlayer == playerX ? playerO.name + "'s turn"
                : playerX.name + "'s turn";
                cellDiv.classList.remove("winner-cell");
            }
        })
    }
    function attachEventListeners(){
        gameBoardDiv.addEventListener("click", (event)=>{
            if(event.target && event.target.id){
                gameBoard.handleMove(Number(event.target.id));
            }
        })
        gameBoardDiv.addEventListener("mousemove", (event) => {
            if(touchDevice) return;
            customPointer.style.display = "block"
            customPointer.style.left = `${event.pageX}px`;
            customPointer.style.top = `${event.pageY}px`;
        });
        document.addEventListener("touchstart", () => {
            touchDevice = true;
        });
        
        saveBtn.addEventListener("click", (event)=>{
            event.preventDefault();
            if(xInput.value){playerX.name = xInput.value};
            if(oInput.value){playerO.name = oInput.value};
            form.style.display = "none";
        })
    }
    function updatePointerMarker(player) {
        customPointer.textContent = player.marker;
        customPointer.style.color = player.marker === "x" ? "white" : "firebrick";
    }
    return {renderBoard,announceWinner,updatePointerMarker,attachEventListeners}
})()

const gameBoard = (function(){
    let board = ["","","","","","","","",""];
    const winningCases = [
        [0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,5,8], [2,4,6], [3,4,5],[6,7,8]
    ]
    let roundWinner;
    let activePlayer = playerX;
    let gameOver = false;

    function handleMove(cell){
        if(gameOver){resetGame();}
            if(addMoveToBoard(cell)){
                checkWin();
                checkTie();
                switchPlayer();
                if(!roundWinner){
                    renderUI.renderBoard(activePlayer,undefined,board)
                }
            }
    }
    function addMoveToBoard(cell){
        if(board[cell] == ""){
            board[cell] = activePlayer.marker;
            activePlayer.cells.push(cell);
            return true;
        }
    }
    function checkWin(){
            const winCase = winningCases.find(element => element.every(index => activePlayer.cells.includes(index)))
            if (winCase) {
                roundWinner = activePlayer;
                gameOver = true;
                renderUI.announceWinner(roundWinner,winCase,board);
            }
    }
    function checkTie(){
        if (!roundWinner && board.every(cell => cell !== "")) {
            roundWinner = "tie";
            gameOver = true;
            renderUI.announceWinner(roundWinner,undefined,board);
        }
    }
    function resetGame(){
        board.fill("");
        playerX.cells = [];
        playerO.cells = [];
        roundWinner = undefined;
        gameOver = false;
    }
    function switchPlayer(){activePlayer = activePlayer == playerX ? playerO 
        : playerX; renderUI.updatePointerMarker(activePlayer);}
    return {handleMove};
})();

renderUI.attachEventListeners();