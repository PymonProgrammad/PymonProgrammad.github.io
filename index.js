// ===================== CONSTANTS ======================

// ----------------------- Colors -----------------------
let TOKEN_COLOR = "lightcoral";
let TOKEN_HOVER_COLOR = "lightpink";
let TOKEN_CONFLICT_COLOR = "orange";
let CELL_COLOR = "white";
let CELL_HOVER_COLOR = "lightgray";
let CELL_CONFLICT_COLOR = "lightyellow";
// -------------------- Cell Parameters -----------------
let CELL_SIZE = 6;	// em
// ------------------ Default Data ----------------------
let INIT_POINTS = [
	[-6, 9, -2,  5],
	[ 8, 2, -7, -6],
	[-8, 2, -4, -3],
	[-3, 3, -4,  7]
];
// ------------------------------------------------------


// ================== HTML ELEMENTS =====================

// ------------------ "scroll" Div ----------------------
let scrollDiv = document.getElementById("scroll");
// --- Created
let grilleTbl = document.createElement("table");
// ------------------- "controle" Div -------------------
let controleDiv = document.getElementById("controle");
// --- Gotten
let nInput = document.getElementById("n");
let xInput = document.getElementById("x");
let pInput = document.getElementById("p");
let minInput = document.getElementById("val_min");
let maxInput = document.getElementById("val_max");
let generBtn = document.getElementById("random");
let clearBtn = document.getElementById("clear");
let colorCheck = document.getElementById("color");
let modifCheck = document.getElementById("modif");
// --- Created
let scorePar = document.createElement("p");
let tokenNbPar = document.createElement("p");
// ------------------------------------------------------


// =================== GLOBAL VARIABLES =================

// --------------------- Problem Data -------------------
let n = 4;
let x = 4;
let p = 10;

let val_min = -10;
let val_max = 10;

let score = 0;
let tokenCount = 0;

let hoveredCell = null;
// ------------------------------------------------------


// ===================== FUNCTIONS ======================

// ----------------------- Utils ------------------------
function clamp(value, min, max)
{
	return (value < min) ? min : ((value > max) ? max : value);
}
// --------------- "Grille" Computations ----------------
function conflict(cell1, cell2)
{
	if (cell1.x == cell2.x && cell1.y == cell2.y) return false;
	
	var diffx = cell1.x - cell2.x;
	var diffy = cell1.y - cell2.y;
	return (cell1.x == cell2.x || cell1.y == cell2.y || diffx == diffy || diffx == -diffy);
}

function conflictCount(cell)
{
	var count = 0;
	for (var i=0; i < n; ++i)
	{
		for (var j=0; j < n; ++j)
		{
			var otherCell = grilleTbl.childNodes[i].childNodes[j];
			if (taken(otherCell) && conflict(cell, otherCell)) ++count;
		}
	}
	return count;
}
// ------------------------------------------------------


// =================== I/O FUNCTIONS ====================

// ------------------ Input Functions -------------------
function getInput(inputElement)
{
	var value = parseInt(inputElement.value);
	var min = parseInt(inputElement.min);
	var max = parseInt(inputElement.max);
	value = clamp(value, min, max);
	return !isNaN(value) ? value : parseInt(inputElement.defaultValue);
}
// ------------------ Output Functions ------------------
function updatePars()
{
	scorePar.textContent = "Score : " + score;
	tokenNbPar.textContent = "Jetons restants : " + (x - tokenCount);
	if (tokenCount == x) tokenNbPar.style.color = "red";
	else tokenNbPar.style.color = "black";
}

function updateInputState()
{
	var inputsToDisable = [nInput, xInput, pInput, minInput, maxInput, generBtn, modifCheck];
	for (var i=0; i < inputsToDisable.length; ++i)
		inputsToDisable[i].disabled = (tokenCount > 0);
	if (tokenCount > 0)
    {
        modifCheck.checked = false;
        scrollDiv.style.overflow = "auto";
    }
}

function colorConflicts(cell, cellColor, tokenColor)
{
	var otherCell;
	
	for (var i=0; i < n; ++i)
	{
		otherCell = grilleTbl.childNodes[cell.y].childNodes[i];
		if (i != cell.x)
		{
			otherCell.style.backgroundColor = taken(otherCell) ? tokenColor : cellColor;
		}
		otherCell = grilleTbl.childNodes[i].childNodes[cell.x];
		if (i != cell.y)
			otherCell.style.backgroundColor = taken(otherCell) ? tokenColor : cellColor;
	}
	
	var i, j;
	
	i = cell.y; j = cell.x;
	while (i > 0 && j > 0) { --i; --j; }
	while (i < n && j < n)
	{
		otherCell = grilleTbl.childNodes[i].childNodes[j];
		if (i != cell.y)
			otherCell.style.backgroundColor = taken(otherCell) ? tokenColor : cellColor;
		++i; ++j;
	}
	
	i = cell.y; j = cell.x;
	while (i > 0 && j < n - 1) { --i; ++j; }
	while (i < n && j >= 0)
	{
		otherCell = grilleTbl.childNodes[i].childNodes[j];
		if (i != cell.y)
			otherCell.style.backgroundColor = taken(otherCell) ? tokenColor : cellColor;
		++i; --j;
	}
}
// ------------------------------------------------------


// ================== EVENT FUNCTIONS ===================

// -------------------- Cell Events ---------------------
function cellClicked(event)
// Add / Remove token on that cell
{
	var cell = event.target;
	if (taken(cell))
	{
		score -= parseInt(cell.textContent);
		score += conflictCount(cell) * p;
		cell.style.backgroundColor = CELL_COLOR;
		--tokenCount;
	}
	else if (tokenCount < x)
	{
		score += parseInt(cell.textContent);
		score -= conflictCount(cell) * p;
		cell.style.backgroundColor = TOKEN_COLOR;
		++tokenCount;
	}
	updatePars();
	updateInputState();
}

function cellHovered(event)
{
	var cell = event.target;
	if (taken(cell))
		cell.style.backgroundColor = TOKEN_HOVER_COLOR;
	else
		cell.style.backgroundColor = CELL_HOVER_COLOR;
	if (colorCheck.checked)
		colorConflicts(cell, CELL_CONFLICT_COLOR, TOKEN_CONFLICT_COLOR);
	hoveredCell = cell;
}

function cellLeft(event)
{
	var cell = event.target;
	if (taken(cell))
		cell.style.backgroundColor = TOKEN_COLOR;
	else
		cell.style.backgroundColor = CELL_COLOR;
	colorConflicts(cell, CELL_COLOR, TOKEN_COLOR);
	hoveredCell = null;
}

function cellWheeled(event)
// Changes Cell's value
{
	var cell = event.target;
	
	if (tokenCount > 0 || !modifCheck.checked) return;
	
	var range = val_max - val_min + 1;
	var delta = (event.deltaY == 0) ? 0 : event.deltaY / Math.abs(event.deltaY);
	var newValue = parseInt(cell.textContent);
	newValue -= val_min;
	newValue += range - delta;
	newValue = (newValue % range) + val_min;
	cell.textContent = newValue;
}
// -------------------- Inputs Events -------------------
function generate(event)
{
	if (tokenCount > 0) return;
	
	var range = val_max - val_min + 1;
	for (var i=0; i < n; ++i)
	{
		for (var j=0; j < n; ++j)
		{
			grilleTbl.childNodes[i].childNodes[j].textContent = Math.floor(Math.random() * range + val_min);
		}
	}
}

function clear(event)
{
	for (var i=0; i < n; ++i)
	{
		for (var j=0; j < n; ++j)
		{
			if (taken(grilleTbl.childNodes[i].childNodes[j]))
			{
				grilleTbl.childNodes[i].childNodes[j].style.backgroundColor = CELL_COLOR;
			}
		}
	}
	if (hoveredCell != null && hoveredCell.style.backgroundColor == CELL_COLOR)
		hoveredCell.style.backgroundColor = CELL_HOVER_COLOR;
	score = 0;
	tokenCount = 0;
	updatePars();
	updateInputState();
}

function updateN(event)
{
	var newN = getInput(nInput);
	if (newN > n)
	{
		for (var i=0; i < (newN - n); ++i)
		{
			grilleTbl.appendChild(document.createElement("tr"));
			for (var j=0; j < n; ++j)
			{
				grilleTbl.childNodes[j].appendChild(createCell(n+i, j));
				grilleTbl.childNodes[n+i].appendChild(createCell(j, n+i));
			}
			for (var j=0; j < (newN - n); ++j)
			{
				grilleTbl.childNodes[n+i].appendChild(createCell(n+j, n+i));
			}
		}
	}
	else if (newN < n)
	{
		for (var i=0; i < (n - newN); ++i)
		{
			for (var j=0; j < newN; ++j)
			{
				grilleTbl.childNodes[j].removeChild(grilleTbl.childNodes[j].childNodes[newN]);
			}
		}
		for (var i=0; i < (n - newN); ++i)
		{
			grilleTbl.removeChild(grilleTbl.childNodes[newN]);
		}
	}
	n = newN;
	nInput.value = n;
	xInput.max = n * n;
	if (xInput.value == xInput.defaultValue) x = n;
	xInput.defaultValue = n;
	
	x = clamp(x, xInput.min, xInput.max);
	xInput.value = x;
	
	updatePars();
	setGrilleSize();
}

function updateX(event)
{
	x = getInput(xInput);
	xInput.value = x;
	updatePars();
}

function updateP(event)
{
	p = getInput(pInput);
	pInput.value = p;
}

function updateMin(event)
{
	val_min = getInput(minInput);
	minInput.value = val_min;
	maxInput.min = val_min;
	for (var i=0; i < n; ++i)
	{
		for (var j=0; j < n; ++i)
		{
			if (parseInt(grilleTbl.childNodes[i].childNodes[j].textContent) < val_min)
			{
				grilleTbl.childNodes[i].childNodes[j].textContent = val_min;
			}
		}
	}
}

function updateMax(event)
{
	val_max = getInput(maxInput);
	maxInput.value = val_max;
	minInput.max = val_max;
	for (var i=0; i < n; ++i)
	{
		for (var j=0; j < n; ++i)
		{
			if (parseInt(grilleTbl.childNodes[i].childNodes[j].textContent) > val_max)
			{
				grilleTbl.childNodes[i].childNodes[j].textContent = val_max;
			}
		}
	}
}

function updateColor(event)
{
	if (hoveredCell == null) return;
	if (event.target.checked)
		colorConflicts(hoveredCell, CELL_CONFLICT_COLOR, TOKEN_CONFLICT_COLOR);
	else
		colorConflicts(hoveredCell, CELL_COLOR, TOKEN_COLOR);
}

function updateModif(event)
{
    if (event.target.checked) scrollDiv.style.overflow = "hidden";
    else scrollDiv.style.overflow = "auto";
}
// ------------------------------------------------------


// ================ "GRILLE" FUNCTIONS ==================

// ------------------ Cell Functions --------------------
function createCell(x, y, value=Math.round((val_max+val_min)/2))
{
	var newCell = document.createElement("td");
	
	newCell.textContent = value;
	newCell.x = x;
	newCell.y = y;
	
	newCell.style.backgroundColor = CELL_COLOR;
	setCellSize(newCell);
	
	newCell.addEventListener("click", cellClicked);
	newCell.addEventListener("mouseover", cellHovered);
	newCell.addEventListener("mouseleave", cellLeft);
	newCell.addEventListener("wheel", cellWheeled);
	
	return newCell;
}

function setCellSize(cell)
{
	cell.style.minWidth = CELL_SIZE + "em";
	cell.style.maxWidth = CELL_SIZE + "em";
	cell.style.minHeight = CELL_SIZE + "em";
	cell.style.maxHeight = CELL_SIZE + "em";
}

function taken(cell)
{
	var bgColor = cell.style.backgroundColor;
	return (bgColor == TOKEN_COLOR || bgColor == TOKEN_HOVER_COLOR || bgColor == TOKEN_CONFLICT_COLOR);
}

function points(cell)
{
	return parseInt(cell.textContent);
}
// ----------------- Table Functions --------------------
function initGrille()
{
	grilleTbl.id = "grille";
	
	for (var i=0; i < n; ++i)
	{
		var row = document.createElement("tr");
		grilleTbl.appendChild(row);
		for (var j=0; j < n; ++j)
		{
			var cell = createCell(j, i, INIT_POINTS[i][j]);
			row.appendChild(cell);
		}
	}
	
	setGrilleSize();
	grilleTbl.style.margin = "auto";
}

function setGrilleSize()
{
	var grilleSize = n * CELL_SIZE;
	grilleTbl.style.minWidth = grilleSize + "em";
	grilleTbl.style.maxWidth = grilleSize + "em";
	grilleTbl.style.minHeight = grilleSize + "em";
	grilleTbl.style.maxHeight = grilleSize + "em";
}
//-------------------------------------------------------


// ================ *** MAIN SCRIPT *** =================

// Appending Childs
scrollDiv.appendChild(grilleTbl);

controleDiv.appendChild(scorePar);
controleDiv.appendChild(tokenNbPar);

// Initialisation
updatePars();

initGrille();

nInput.defaultValue = n;
xInput.defaultValue = x;
pInput.defaultValue = p;
minInput.defaultValue = val_min;
maxInput.defaultValue = val_max;

nInput.value = nInput.defaultValue;
xInput.value = xInput.defaultValue;
pInput.value = pInput.defaultValue;
minInput.value = minInput.defaultValue;
maxInput.value = maxInput.defaultValue;

minInput.max = val_max;
maxInput.min = val_min;

scrollDiv.style.overflow = modifCheck.checked ? "hidden" : "auto";

// Event Listeners

generBtn.addEventListener("click", generate);
clearBtn.addEventListener("click", clear);

nInput.addEventListener("change", updateN);
xInput.addEventListener("change", updateX);
pInput.addEventListener("change", updateP);
minInput.addEventListener("change", updateMin);
maxInput.addEventListener("change", updateMax);

colorCheck.addEventListener("click", updateColor);
modifCheck.addEventListener("click", updateModif)