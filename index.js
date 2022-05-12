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

// ------------ "contenu" ("scroll") Div ----------------
let Contenu = document.getElementById("scroll");
// --- Created
let Grille = document.createElement("table");
// ------------------- "controle" Div -------------------
let Controle = document.getElementById("controle");
// --- Gotten
let NInput = document.getElementById("n");
let XInput = document.getElementById("x");
let PInput = document.getElementById("p");
let MinInput = document.getElementById("val_min");
let MaxInput = document.getElementById("val_max");
let GenerBtn = document.getElementById("random");
let ClearBtn = document.getElementById("clear");
let ColorCheck = document.getElementById("color");
let ModifCheck = document.getElementById("modif");
// --- Created
let ScorePar = document.createElement("p");
let TokenNbPar = document.createElement("p");
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

let HoveredCell = null;
// ------------------------------------------------------


// ===================== FUNCTIONS ======================

// ----------------------- Utils ------------------------
function clamp(value, min, max)
{
	return (value < min) ? min : ((value > max) ? max : value);
}
// --------------- "Grille" Computations ----------------
function conflict(Cell1, Cell2)
{
	if (Cell1.x == Cell2.x && Cell1.y == Cell2.y) return false;
	
	var diffx = Cell1.x - Cell2.x;
	var diffy = Cell1.y - Cell2.y;
	return (Cell1.x == Cell2.x || Cell1.y == Cell2.y || diffx == diffy || diffx == -diffy);
}

function conflictCount(Cell)
{
	var count = 0;
	for (var i=0; i < n; ++i)
	{
		for (var j=0; j < n; ++j)
		{
			var OtherCell = Grille.childNodes[i].childNodes[j];
			if (taken(OtherCell) && conflict(Cell, OtherCell)) ++count;
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
	ScorePar.textContent = "Score : " + score;
	TokenNbPar.textContent = "Jetons restants : " + (x - tokenCount);
	if (tokenCount == x) TokenNbPar.style.color = "red";
	else TokenNbPar.style.color = "black";
}

function updateInputState()
{
	var inputsToDisable = [NInput, XInput, PInput, MinInput, MaxInput, GenerBtn, ModifCheck];
	for (var i=0; i < inputsToDisable.length; ++i)
		inputsToDisable[i].disabled = (tokenCount > 0);
	if (tokenCount > 0) ModifCheck.checked = false;
}

function colorConflicts(Cell, cellColor, tokenColor)
{
	var OtherCell;
	
	for (var i=0; i < n; ++i)
	{
		OtherCell = Grille.childNodes[Cell.y].childNodes[i];
		if (i != Cell.x)
		{
			OtherCell.style.backgroundColor = taken(OtherCell) ? tokenColor : cellColor;
		}
		OtherCell = Grille.childNodes[i].childNodes[Cell.x];
		if (i != Cell.y)
			OtherCell.style.backgroundColor = taken(OtherCell) ? tokenColor : cellColor;
	}
	
	var i, j;
	
	i = Cell.y; j = Cell.x;
	while (i > 0 && j > 0) { --i; --j; }
	while (i < n && j < n)
	{
		OtherCell = Grille.childNodes[i].childNodes[j];
		if (i != Cell.y)
			OtherCell.style.backgroundColor = taken(OtherCell) ? tokenColor : cellColor;
		++i; ++j;
	}
	
	i = Cell.y; j = Cell.x;
	while (i > 0 && j < n - 1) { --i; ++j; }
	while (i < n && j >= 0)
	{
		OtherCell = Grille.childNodes[i].childNodes[j];
		if (i != Cell.y)
			OtherCell.style.backgroundColor = taken(OtherCell) ? tokenColor : cellColor;
		++i; --j;
	}
}
// ------------------------------------------------------


// ================== EVENT FUNCTIONS ===================

// -------------------- Cell Events ---------------------
function cellClicked(event)
// Add / Remove token on that cell
{
	var Cell = event.target;
	if (taken(Cell))
	{
		score -= parseInt(Cell.textContent);
		score += conflictCount(Cell) * p;
		Cell.style.backgroundColor = CELL_COLOR;
		--tokenCount;
	}
	else if (tokenCount < x)
	{
		score += parseInt(Cell.textContent);
		score -= conflictCount(Cell) * p;
		Cell.style.backgroundColor = TOKEN_COLOR;
		++tokenCount;
	}
	updatePars();
	updateInputState();
}

function cellHovered(event)
{
	var Cell = event.target;
	if (taken(Cell))
		Cell.style.backgroundColor = TOKEN_HOVER_COLOR;
	else
		Cell.style.backgroundColor = CELL_HOVER_COLOR;
	if (ColorCheck.checked)
		colorConflicts(Cell, CELL_CONFLICT_COLOR, TOKEN_CONFLICT_COLOR);
	HoveredCell = Cell;
}

function cellLeft(event)
{
	var Cell = event.target;
	if (taken(Cell))
		Cell.style.backgroundColor = TOKEN_COLOR;
	else
		Cell.style.backgroundColor = CELL_COLOR;
	colorConflicts(Cell, CELL_COLOR, TOKEN_COLOR);
	HoveredCell = null;
}

function cellWheeled(event)
// Changes Cell's value
{
	var Cell = event.target;
	
	if (tokenCount > 0 || !ModifCheck.checked) return;
	
	var range = val_max - val_min + 1;
	var delta = (event.deltaY == 0) ? 0 : event.deltaY / Math.abs(event.deltaY);
	var newValue = parseInt(Cell.textContent);
	newValue -= val_min;
	newValue += range - delta;
	newValue = (newValue % range) + val_min;
	Cell.textContent = newValue;
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
			Grille.childNodes[i].childNodes[j].textContent = Math.floor(Math.random() * range + val_min);
		}
	}
}

function clear(event)
{
	for (var i=0; i < n; ++i)
	{
		for (var j=0; j < n; ++j)
		{
			if (taken(Grille.childNodes[i].childNodes[j]))
			{
				Grille.childNodes[i].childNodes[j].style.backgroundColor = CELL_COLOR;
			}
		}
	}
	if (HoveredCell != null && HoveredCell.style.backgroundColor == CELL_COLOR)
		HoveredCell.style.backgroundColor = CELL_HOVER_COLOR;
	score = 0;
	tokenCount = 0;
	updatePars();
	updateInputState();
}

function updateN(event)
{
	var newN = getInput(NInput);
	if (newN > n)
	{
		for (var i=0; i < (newN - n); ++i)
		{
			Grille.appendChild(document.createElement("tr"));
			for (var j=0; j < n; ++j)
			{
				Grille.childNodes[j].appendChild(createCell(n+i, j));
				Grille.childNodes[n+i].appendChild(createCell(j, n+i));
			}
			for (var j=0; j < (newN - n); ++j)
			{
				Grille.childNodes[n+i].appendChild(createCell(n+j, n+i));
			}
		}
	}
	else if (newN < n)
	{
		for (var i=0; i < (n - newN); ++i)
		{
			for (var j=0; j < newN; ++j)
			{
				Grille.childNodes[j].removeChild(Grille.childNodes[j].childNodes[newN]);
			}
		}
		for (var i=0; i < (n - newN); ++i)
		{
			Grille.removeChild(Grille.childNodes[newN]);
		}
	}
	n = newN;
	NInput.value = n;
	XInput.max = n * n;
	if (XInput.value == XInput.defaultValue) x = n;
	XInput.defaultValue = n;
	
	x = clamp(x, XInput.min, XInput.max);
	XInput.value = x;
	
	updatePars();
	setGrilleSize();
}

function updateX(event)
{
	x = getInput(XInput);
	XInput.value = x;
	updatePars();
}

function updateP(event)
{
	p = getInput(PInput);
	PInput.value = p;
}

function updateMin(event)
{
	val_min = getInput(MinInput);
	MinInput.value = val_min;
	MaxInput.min = val_min;
	for (var i=0; i < n; ++i)
	{
		for (var j=0; j < n; ++i)
		{
			if (parseInt(Grille.childNodes[i].childNodes[j].textContent) < val_min)
			{
				Grille.childNodes[i].childNodes[j].textContent = val_min;
			}
		}
	}
}

function updateMax(event)
{
	val_max = getInput(MaxInput);
	MaxInput.value = val_max;
	MinInput.max = val_max;
	for (var i=0; i < n; ++i)
	{
		for (var j=0; j < n; ++i)
		{
			if (parseInt(Grille.childNodes[i].childNodes[j].textContent) > val_max)
			{
				Grille.childNodes[i].childNodes[j].textContent = val_max;
			}
		}
	}
}

function updateColor(event)
{
	if (HoveredCell == null) return;
	if (event.target.checked)
		colorConflicts(HoveredCell, CELL_CONFLICT_COLOR, TOKEN_CONFLICT_COLOR);
	else
		colorConflicts(HoveredCell, CELL_COLOR, TOKEN_COLOR);
}
// ------------------------------------------------------


// ================ "GRILLE" FUNCTIONS ==================

// ------------------ Cell Functions --------------------
function createCell(x, y, value=Math.round((val_max+val_min)/2))
{
	var NewCell = document.createElement("td");
	
	NewCell.textContent = value;
	NewCell.x = x;
	NewCell.y = y;
	
	NewCell.style.backgroundColor = CELL_COLOR;
	setCellSize(NewCell);
	
	NewCell.addEventListener("click", cellClicked);
	NewCell.addEventListener("mouseover", cellHovered);
	NewCell.addEventListener("mouseleave", cellLeft);
	NewCell.addEventListener("wheel", cellWheeled);
	
	return NewCell;
}

function setCellSize(Cell)
{
	Cell.style.minWidth = CELL_SIZE + "em";
	Cell.style.maxWidth = CELL_SIZE + "em";
	Cell.style.minHeight = CELL_SIZE + "em";
	Cell.style.maxHeight = CELL_SIZE + "em";
}

function taken(Cell)
{
	var bgColor = Cell.style.backgroundColor;
	return (bgColor == TOKEN_COLOR || bgColor == TOKEN_HOVER_COLOR || bgColor == TOKEN_CONFLICT_COLOR);
}

function points(Cell)
{
	return parseInt(Cell.textContent);
}
// ----------------- Table Functions --------------------
function initGrille()
{
	Grille.id = "grille";
	
	for (var i=0; i < n; ++i)
	{
		var Row = document.createElement("tr");
		Grille.appendChild(Row);
		for (var j=0; j < n; ++j)
		{
			var Cell = createCell(j, i, INIT_POINTS[i][j]);
			Row.appendChild(Cell);
		}
	}
	
	setGrilleSize();
	grille.style.margin = "auto";
}

function setGrilleSize()
{
	var grilleSize = n * CELL_SIZE;
	Grille.style.minWidth = grilleSize + "em";
	Grille.style.maxWidth = grilleSize + "em";
	Grille.style.minHeight = grilleSize + "em";
	Grille.style.maxHeight = grilleSize + "em";
}
//-------------------------------------------------------


// ================ *** MAIN SCRIPT *** =================

// Appending Childs
Contenu.appendChild(Grille);

Controle.appendChild(ScorePar);
Controle.appendChild(TokenNbPar);

// Initialisation
updatePars();

initGrille();

NInput.defaultValue = n;
XInput.defaultValue = x;
PInput.defaultValue = p;
MinInput.defaultValue = val_min;
MaxInput.defaultValue = val_max;

NInput.value = NInput.defaultValue;
XInput.value = XInput.defaultValue;
PInput.value = PInput.defaultValue;
MinInput.value = MinInput.defaultValue;
MaxInput.value = MaxInput.defaultValue;

MinInput.max = val_max;
MaxInput.min = val_min;

// Event Listeners

GenerBtn.addEventListener("click", generate);
ClearBtn.addEventListener("click", clear);

NInput.addEventListener("change", updateN);
XInput.addEventListener("change", updateX);
PInput.addEventListener("change", updateP);
MinInput.addEventListener("change", updateMin);
MaxInput.addEventListener("change", updateMax);

ColorCheck.addEventListener("click", updateColor);