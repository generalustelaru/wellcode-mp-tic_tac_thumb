var boardSize = 3, totalTurns = boardSize * boardSize;
var gameState = false, gameTurn, activePlayer;
var cellMonitor = new Map();
function drawBoard() {
    let board = document.getElementById("gameBoard");
    for (let x = 1; x <= boardSize; x++) {
        let row = document.createElement("div");
        row.className = "row";
        for (let y = 1; y <= boardSize; y++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.id = "cell_" + x + y;
            cell.style.backgroundImage="url(graphics/blank.svg)";
            cell.setAttribute("onmouseover", "hover(" + x + y + ")");
            cell.setAttribute("onmouseout", "leave(" + x + y + ")");
            cell.setAttribute("onclick", "select(" + x + y + ")");
            cellMonitor.set("cell_" + x + y, "blank");
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function StartGame() {
    let keyIterator = cellMonitor.keys();
    for (let i = 0; i < totalTurns; i++) {
        cell = document.getElementById(keyIterator.next().value);
        cell.style.backgroundImage="url(graphics/start-up.svg)";
    }   
    setTimeout(clear, 500);
    function clear() {
        let keyIterator = cellMonitor.keys();
        for (let i = 0; i < totalTurns; i++) {
            let nextKey = keyIterator.next().value;
            cell = document.getElementById(nextKey);
            cell.style.backgroundImage="url(graphics/blank.svg)";
            cellMonitor.set(nextKey, "blank");
        }
        gameState = true;
        gameTurn = 1;
        activePlayer = "x";
    }
}

function hover(id) {
    if (gameState == true && cellMonitor.get("cell_" + id) == "blank") {
        document.getElementById("cell_" + id).style.backgroundImage = "url(graphics/hover_" + activePlayer + ".svg)";
   
    }
}

function leave(id) {
    if (gameState == true && cellMonitor.get("cell_" + id) == "blank") {
        document.getElementById("cell_" + id).style.backgroundImage = "url(graphics/blank.svg)";
   
    }
}

function select(id) {
    if (gameState == true && cellMonitor.get("cell_" + id) == "blank") {
        document.getElementById("cell_" + id).style.backgroundImage = "url(graphics/" + activePlayer + ".svg)";
        cellMonitor.set("cell_" + id, activePlayer);
        assertMove(id);
    }
}

function assertMove(id) {
    let coords = parseInt(id);
    let x = Math.floor(coords / 10), y = coords % 10;
    if (victory(x,y)) {
        alert(activePlayer + " won!");
        gameState = false;
    } else {
        gameTurn++;
        if (gameTurn > totalTurns) {
            alert("It's a draw.");
            gameState = false;
        } else if (gameTurn % 2 == 0) {
            activePlayer = "0";
        } else {
            activePlayer = "x";
        }
    }
}

function victory(x, y) {
    if (dashVictory(x) || slashVictory() || barVictory(y) || backSlashVictory()) {
        return true;
    } else {
        return false;
    }

}

function dashVictory(x) {
    for (let y = 1; y <= boardSize; y++) {
       if (cellMonitor.get("cell_" + x + y) != activePlayer) {
           return false; 
       }        
    }
    return true;
}

function barVictory(y) {

    for (let x = 1; x <= boardSize; x++) {
        if (cellMonitor.get("cell_" + x + y) != activePlayer) {
            return false;
        }        
    }
    return true;
}

function slashVictory() {
    let x = boardSize, y = 1;
    for (let slash = 0; slash < boardSize; slash++) {
        if (cellMonitor.get("cell_" + x + y) != activePlayer) {
            return false;
        } 
        x--;
        y++;
    }
    return true;
}

function backSlashVictory() {
    let x = 1, y = 1;
    for (let slash = 0; slash < boardSize; slash++) {
        if (cellMonitor.get("cell_" + x + y) != activePlayer) {
            return false;
        } 
        x++;
        y++
    }
    return true;
}