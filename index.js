let gameActive = true
let currentPlayer = "X"
let gameState = ["","","","","","","","",""]
let multiplayer = true
let totalGames = 1
let cpuMoves = 0
let playerMoves = 0
let player1Moves = 0
let player2Moves = 0
let player1Name = ""
let player2Name = ""
let playerName = ""
let gameStarted = false;
const statusDisplay = document.querySelector('.gameStatus')
const changeModeButton = document.getElementById('changeMode')
const playerNameInput = document.querySelector('#playerName')
const player1NameInput = document.querySelector('#player1Name')
const player2NameInput = document.querySelector('#player2Name')

const drawMessage = () => 'Draw!'

const mode = document.getElementById('mode')

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

statusDisplay.innerHTML = currentPlayerTurn()
mode.innerHTML = multiplayer ? 'Multiplayer' : 'Singleplayer'

// START BUTTON HANDLING
const startButton = document.querySelector('.gameStart')
startButton.addEventListener('click', () => {  
    if (playersNameCheck()){
        if(!gameStarted) {
            assignPlayerNames()
            statusDisplay.innerHTML = currentPlayerTurn()
            statusDisplay.classList.remove('hide')
            document.querySelector('.board').classList.remove('no-click')
            gameStarted = true
        }else{
            console.log('juego ya iniciado')
        }
    } else {
        statusDisplay.innerHTML = "Deben insertarse los nombres de los jugadores"
        statusDisplay.classList.remove('hide')
    }
})

//RESTART BUTTON HANDLING
document.querySelector('.gameRestart').addEventListener('click', restartGame);
function restartGame() {
    totalGames ++
    gameActive = true
    currentPlayer = "X"
    gameState.fill("")
    statusDisplay.innerHTML = currentPlayerTurn()
    event.target.setAttribute('disabled', true)
    document.querySelectorAll('.cell')
        .forEach(cell => {cell.innerHTML = ""})
    if (totalGames === 4) {
        statusDisplay.classList.remove('hide')
        statusDisplay.innerHTML = "Ya se han jugado todas las partidas"
        document.querySelector('.gameRestart').innerText = "Recargar"
        document.querySelector('.gameStart').classList.add('hide')
        document.querySelector('.gameRestart').addEventListener('click', () => window.location.reload())
        
    }

}

// CHANGE BUTTON HANDLING
changeModeButton.addEventListener('click',() =>{
    multiplayer = !multiplayer
    mode.innerHTML = multiplayer ? 'Multiplayer' : 'Singleplayer'
    if (multiplayer) {
        document.querySelector('.singleplayer').classList.add('hide')
        document.querySelector('.multiplayer').classList.remove('hide')
    } else {
        document.querySelector('.multiplayer').classList.add('hide')
        document.querySelector('.singleplayer').classList.remove('hide')
    }
})

//CELL HANDLING
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));

function handleCellPlayed(clickedCell, clickedCellIndex) {

    // const cells = document.querySelectorAll('.cell')
    // cells.forEach((cell, index) => {
    //     gameState[index] = cell.dataset.cellindex
    // } )

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer
    resultValidation()
}

async function handleCellClick(clickedCellEvent) {
    if (multiplayer && currentPlayer === "X") {
        player1Moves ++
    } else if (multiplayer && currentPlayer === "O") {
        player2Moves ++
    } else if (!multiplayer) {
        playerMoves ++
    }
    const clickedCell = clickedCellEvent.target
    const clickedCellIndex = parseInt(clickedCell.dataset.cellindex)
    
    if (gameState[clickedCellIndex] !== "" || !gameActive || totalGames == 3) {
        return
    }

    console.log(clickedCellIndex)

    handleCellPlayed(clickedCell, clickedCellIndex)
    if(gameActive && !multiplayer) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        cpu();
    }
}

// TUNRS HANDLING
function currentPlayerTurn () {
    let playerTurn
    if (multiplayer) {
        playerTurn = (currentPlayer === "X") ? player1Name : player2Name 
    } else {
        playerTurn = (currentPlayer === "X") ? playerName : 'CPU'
    }
    return `${currentPlayer} - ${playerTurn} turn`

}

function playerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X"
    statusDisplay.innerHTML = currentPlayerTurn()
}

// VARIABLES ASSINGMENT - SINGLEPLAYER/MULTIPLAYER

function assignPlayerNames() {
    if (multiplayer) {
        player1Name = player1NameInput.value
        player2Name = player2NameInput.value
    } else {
        playerName = playerNameInput.value
    }
}

function playersNameCheck() {

    if (multiplayer && (player1NameInput.value === "" || player2NameInput.value === "")) {
        return false
    }
    if (!multiplayer && playerNameInput.value === "") {
        return false
    }
    return true
}

//WINNING MESSAGE
function winningMessage() {
    let winnerName;
    if (multiplayer) {
        winnerName = (currentPlayer === "X") ? player1Name : player2Name;
    } else {
        winnerName = (currentPlayer === "X") ? player1Name : (currentPlayer === "O") ? player2Name : playerName;
    }
    return `${currentPlayer} - ${winnerName} wins`;

}

// VALIDATION FOR EVERY MOVE
async function resultValidation() {
    let win = false
    for (let i = 0; i < gameState.length - 1; i++) {
        const winCondition = winningCombinations[i]
        let a = gameState[winCondition[0]]
        let b = gameState[winCondition[1]]
        let c = gameState[winCondition[2]]
        if (a === "" || b === "" || c === "") {
            continue
        }
        if (a ===b && b===c) {
            win = true;
            winGame()
            break
        }
    }

    if (win) {
        let winnerName;
        let score;
        if (multiplayer) {
            if (currentPlayer === "X") {
                winnerName = player1Name;
                score = player1Moves
            } else {
                winnerName = player2Name;
                score = player1Moves
            }
        } else {
            if (currentPlayer === "X") {
                winnerName = playerName;
                score = playerMoves
            } else {
                winnerName = 'CPU';
            }
        }
        if (winnerName !=="CPU"){
            addPlayerScore (winnerName, score)
        }

        statusDisplay.innerHTML = winningMessage()
        gameActive = false
        document.querySelector('.gameRestart').removeAttribute('disabled')
        
        console.log(totalGames, player1Moves, player2Moves,playerMoves, cpuMoves)
        return
    }

    let gameDraw = !gameState.includes("")
    if (gameDraw) {
        statusDisplay.innerHTML = drawMessage()
        gameActive = false
        document.querySelector('.gameRestart').removeAttribute('disabled')
        console.log(totalGames, player1Moves, player2Moves,playerMoves, cpuMoves)
        return
    }

    playerChange()
}

function winGame() {
    statusDisplay.innerHTML = winningMessage()
}

// CPU "IA"
function cpu () {
    cpuMoves ++
    let randomCell = Math.floor(Math.random() * 9)
    if (gameState[randomCell] !== "") {
        cpu()
    } else if (gameState[4] === "") {
        cellSelected = document.getElementById("4")
        handleCellPlayed(cellSelected, "4")
    } else {
        cellSelected = document.getElementById(randomCell)
        handleCellPlayed(cellSelected, randomCell)
    }
}


async function addPlayerScore (player, score) {
    const headers = {"Content-Type": "application/json"}
    const res = await fetch(`http://localhost:3000/players?name=${player}`)
    const playerData = await res.json()

    if(Object.keys(playerData).length == 0) {
        const dataToInsert = {
            "name": player,
            "partidasGanadas": [
                {
                    "totalMovimientos": score
                }
            ]}
        console.log(JSON.stringify(dataToInsert));
        const response = await fetch(`http://localhost:3000/players`,{method:"POST", headers: headers, body: JSON.stringify(dataToInsert)})
        console.log(response);
        await console.log(response)
    } else {
        const id = playerData[0].id
        const playerWins = playerData[0].partidasGanadas
        const nextGameId = playerWins.length > 0 ? playerWins.length + 1 : 1;
        // playerWins.push({ "totalMovimientos": score })
        const dataToUpdate = {
            "name": player,
            "partidasGanadas": [...playerWins, {"idPartida": nextGameId, "totalMovimientos": score}]
        }
        const options = {
            method: "PUT",
            headers : {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToUpdate)
    }
        const response = await fetch(`http://localhost:3000/players/${id}`, options)
        await console.log(response)
    }
}