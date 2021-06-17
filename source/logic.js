var cellSize = 168, boardSize = 3, totalTurns = boardSize * boardSize;  // cellSize and style settings that use it (width, height) are experimental.
var gameState = false, gameTurn, activePlayer;                          // You can change boardSize and use cellSize to fit different grids on your screen.
var cellMonitor = new Map(); // Used to store and check cell states     // The game works in any configuration.
function drawBoard() {
    let board = document.getElementById("gameBoard");
    //board.style.height = (cellSize * boardSize) + "px";
    //board.style.width = (cellSize * boardSize) + "px";
    for (let x = 1; x <= boardSize; x++) {
        let row = document.createElement("div");
        row.className = "row";
        //row.style.height = cellSize + "px";
        //row.style.width = (cellSize * boardSize) + "px";
        for (let y = 1; y <= boardSize; y++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            //cell.style.height = cellSize + "px";
            //cell.style.width = cellSize + "px";
            //cell.style.backgroundSize = cellSize + "px";
            cell.id = "cell_" + x + y; // The id also acts as the cell coordinates
            cell.style.backgroundImage="url(graphics/blank.svg)";
            cell.setAttribute("onmouseover", "hover(" + x + y + ")");
            cell.setAttribute("onmouseout", "leave(" + x + y + ")");
            cell.setAttribute("onclick", "select(" + x + y + ")");
            cellMonitor.set("cell_" + x + y, "blank"); // The cellMonitor map can store values "blank", "x", and "0" respectively
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function startGame() {
    let keyIterator = cellMonitor.keys(); // We iterate through each cell on the board...
    for (let i = 0; i < totalTurns; i++) {
        cell = document.getElementById(keyIterator.next().value);
        cell.style.backgroundImage="url(graphics/start-up.svg)"; // ...to show a fancy pattern and then...
    }   
    setTimeout(clearBoard, 500); // ...to clear it for a new game
}

function clearBoard() {
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

function hover(id) { // Empty game squares are highlighted with the current player's symbol for clarity and prettyness
    if (gameState == true && cellMonitor.get("cell_" + id) == "blank") {
        document.getElementById("cell_" + id).style.backgroundImage = "url(graphics/hover_" + activePlayer + ".svg)";
   
    }
}

function leave(id) {
    if (gameState == true && cellMonitor.get("cell_" + id) == "blank") {
        document.getElementById("cell_" + id).style.backgroundImage = "url(graphics/blank.svg)";
   
    }
}

function select(id) { // Clicking applies a bolder bersion of the symbol and disables the square for any interaction, as only "blank" values count for state changes
    if (gameState == true && cellMonitor.get("cell_" + id) == "blank") {
        document.getElementById("cell_" + id).style.backgroundImage = "url(graphics/" + activePlayer + ".svg)";
        cellMonitor.set("cell_" + id, activePlayer);
        advanceTurn(id);
    }
}

function advanceTurn(id) { // Continuation depends on a victory check which requires coordinates
    let coords = parseInt(id);
    let x = Math.floor(coords / 10), y = coords % 10; // We convert the clicked cell's id into coordinates x and y
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

function victory(x, y) { // Centralization of victory assertions
    if (dashVictory(x) || slashVictory() || barVictory(y) || backSlashVictory()) {
        return true;
    } else {
        return false;
    }

}

function dashVictory(x) { // Perform a horizontal victory check
    for (let y = 1; y <= boardSize; y++) {
       if (cellMonitor.get("cell_" + x + y) != activePlayer) {
           return false; 
       }        
    }
    return true;
}

function barVictory(y) { // Perform a vertical victory check

    for (let x = 1; x <= boardSize; x++) {
        if (cellMonitor.get("cell_" + x + y) != activePlayer) {
            return false;
        }        
    }
    return true;
}

function slashVictory() { // Perform a secondary diagonal victory check
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

function backSlashVictory() { // Perform a main diagonal victory check
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