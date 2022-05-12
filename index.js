let tokenColor = "lightcoral";
let tokenLightColor = "lightpink";

let score = 0;
let tokenCount = 0;

let n = 4;
let x = 4;
let p = 10;
let val_min = -10 ;
let val_max = 10 ;

let points = [[-6, 9, -2, 5],
                [8, 2, -7, -6],
                [-8, 2, -4, -3],
                [-3, 3, -4, 7]
            ];

let cellSize = 6;

let contenu;    // Stores document's "contenu" div
let scorePar;
let nbTokenPar;
let controle;
let grille;

let nInput;
let xInput;
let pInput;
let minInput;
let maxInput;

function clamp(val, min, max)
{
    return (val < min) ? min : ((val > max) ? max : val);
}

function getInput(id)
{
    var value = parseInt(document.getElementById(id).value);
    var minValue = parseInt(document.getElementById(id).min);
    var maxValue = parseInt(document.getElementById(id).max);
    value = clamp(value, minValue, maxValue);
    if (isNaN(value)) value = parseInt(document.getElementById(id).defaultValue);
    return value;
}

function nbConflicts(cell)
{
    var count = 0;
    var table = cell.parentNode.parentNode;
    for (var i=0; i < n; ++i)
    {
        for (var j=0; j < n; ++j)
        {
            var otherCell = table.childNodes[i].childNodes[j];
            if (otherCell.pos != cell.pos && otherCell.taken)
            {
                var diffx = (cell.pos % n) - (otherCell.pos % n);
                var diffy = ~~(cell.pos / n) - ~~(otherCell.pos / n);

                if (diffx == 0 || diffy == 0 || diffx == diffy || diffx == -diffy) count++;
            }
        }
    }

    return count;
}

function switchToken(event)
{
    var token = event.target;
    if (token.taken)
    {
        score -= token.points;
        score += nbConflicts(token) * p;
        --tokenCount;
        token.style.backgroundColor = "white";
        token.taken = false;
    }
    else if (tokenCount < x)
    {
        score += token.points;
        score -= nbConflicts(token) * p;
        ++tokenCount;
        token.style.backgroundColor = tokenColor;
        token.taken = true;
    }
    scorePar.textContent = "Score : "+score;
    nbTokenPar.textContent = "Jetons restants : "+(x-tokenCount);

    if (tokenCount > 0)
    {
        var childs = controle.querySelectorAll("input");
        for (var i = 0; i < childs.length; ++i)
        {
            childs[i].disabled = true;
        }
    }
    else
    {
        var childs = controle.querySelectorAll("input");
        for (var i = 0; i < childs.length; ++i)
        {
            childs[i].disabled = false;
        }
    }
}

function generatePoints()
{
    points = [];
    for (var i=0; i < n; ++i)
    {
        points.push([]);
        for (var j=0; j < n; ++j)
        {
            points[i].push(Math.floor(Math.random() * (val_max-val_min+1) + val_min));
        }
    }
}

function createCell(pos, value=val_min)
{
    var newCell = document.createElement("td");

    newCell.points = value;
    newCell.pos = pos;
    newCell.taken = false;
    newCell.textContent = newCell.points;

    newCell.style.backgroundColor = "white";
    newCell.style.maxWidth = cellSize + "em";
    newCell.style.maxHeight = cellSize + "em";
    newCell.style.minWidth = cellSize + "em";
    newCell.style.minHeight = cellSize + "em";

    newCell.addEventListener("click", switchToken);
    newCell.addEventListener("mouseover", function(event) {
                                            if (event.target.taken)
                                                event.target.style.backgroundColor = tokenLightColor;
                                            else
                                                event.target.style.backgroundColor = "lightgray";
                                        });
    newCell.addEventListener("mouseleave", function(event) {
                                            if (event.target.taken)
                                                event.target.style.backgroundColor = tokenColor;
                                            else
                                                event.target.style.backgroundColor = "white";
                                        });
    newCell.addEventListener("wheel", function(event) {
                                        if (tokenCount==0)
                                        {
                                            var range = val_max - val_min + 1;
                                            event.target.points += -val_min - event.deltaY / Math.abs(event.deltaY) + range;
                                            event.target.points = (event.target.points % range) + val_min;
                                            event.target.textContent = event.target.points;
                                        }
                                    });

    return newCell;
}

function createTable()
{
    grille = document.createElement("table");
    grille.id = "grille";

    for (var i = 0; i < n; i++)
    {
        var row = document.createElement("tr");

        for (var j = 0; j < n; j++)
        {
            var cell = createCell(i * n + j, points[i][j]);
            row.appendChild(cell);
        }

        grille.appendChild(row);
    }

    var tblSize = n * cellSize;
    grille.style.maxWidth = tblSize + "em";
    grille.style.maxHeight = tblSize + "em";
    grille.style.minWidth = tblSize + "em";
    grille.style.minHeight = tblSize + "em";

    contenu.appendChild(grille);

    scorePar.textContent = "Score : 0";
    nbTokenPar.textContent = "Jetons restants : "+x;
}

function generateTable()
{
    if (tokenCount != 0) return;

    generatePoints();
    for (var i=0; i < n; ++i)
    {
        for (var j=0; j < n; ++j)
        {
            grille.childNodes[i].childNodes[j].points = points[i][j];
            grille.childNodes[i].childNodes[j].textContent = points[i][j];
        }
    }

    tokenCount = 0;
    score = 0;

    scorePar.textContent = "Score : "+score;
    nbTokenPar.textContent = "Jetons restants : "+(x-tokenCount);
}

contenu = document.getElementsByClassName("contenu")[0];
controle = document.getElementsByClassName("controle")[0];

scorePar = document.createElement("p");
nbTokenPar = document.createElement("p");

controle.appendChild(scorePar);
controle.appendChild(nbTokenPar);

createTable();

nInput = document.getElementById("n");
xInput = document.getElementById("x");
pInput = document.getElementById("p");
minInput = document.getElementById("val_min");
maxInput = document.getElementById("val_max");

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

nInput.addEventListener("change", function(event) {
                                    if (tokenCount != 0) { nInput.value = n; return; }
                                    var newN = getInput("n");
                                    if (newN > n)
                                    {
                                        for (var i=0; i < newN; ++i)
                                        {
                                            for (var j=0; j < newN; ++j)
                                            {
                                                if (i < points.length && j < points[i].length) grille.childNodes[i].childNodes[j].pos = i * newN + j;
                                                else 
                                                {
                                                    if (i >= points.length)
                                                    {
                                                        points.push([]);
                                                        grille.appendChild(document.createElement("tr"));
                                                    }
                                                    points[i].push(val_min);
                                                    grille.childNodes[i].appendChild(createCell(i*newN+j));
                                                }
                                            }
                                        }
                                    }
                                    else if (newN < n)
                                    {
                                        for (var i=0; i < points.length; ++i)
                                        {
                                            for (var j=0; j < points[i].length; ++j)
                                            {
                                                if (i < newN && j < newN) grille.childNodes[i].childNodes[j].pos = i * newN + j;
                                                else
                                                {
                                                    points[i].splice(j, 1);
                                                    grille.childNodes[i].removeChild(grille.childNodes[i].childNodes[j]);
                                                    --j;
                                                }
                                            }
                                            if (points[i].length <= 0)
                                            {
                                                points.splice(i, 1);
                                                grille.removeChild(grille.childNodes[i]);
                                                --i;
                                            }
                                        }
                                    }
                                    n = newN;
                                    nInput.value = n;
                                    xInput.max = n * n;
                                    xInput.defaultValue = n;

                                    x = clamp(x, xInput.min, xInput.max);
                                    xInput.value = x;
                                    nbTokenPar.textContent = "Jetons restants : " + (x-tokenCount);

                                    var tblSize = n * cellSize;
                                    grille.style.maxWidth = tblSize + "em";
                                    grille.style.maxHeight = tblSize + "em";
                                    grille.style.minWidth = tblSize + "em";
                                    grille.style.minHeight = tblSize + "em";
                                });

xInput.addEventListener("change", function(event) {
                                    if (tokenCount != 0) { xInput.value = x; return; }
                                    x = getInput("x");
                                    xInput.value = x
                                    
                                    nbTokenPar.textContent = "Jetons restants : " + (x-tokenCount);
                                });

pInput.addEventListener("change", function(event) {
                                    if (tokenCount != 0) { pInput.value = p; return; }
                                    p = getInput("p");
                                    pInput.value = p;
                                });

minInput.addEventListener("change", function(event) {
                                    if (tokenCount != 0) { minInput.value = val_min; return; }
                                    val_min = getInput("val_min");
                                    minInput.value = val_min;
                                    maxInput.min = val_min;
                                    for (var i=0; i < n; ++i)
                                    {
                                        for (var j=0; j < n; ++j)
                                        {
                                            if (grille.childNodes[i].childNodes[j].points < val_min)
                                            {
                                                grille.childNodes[i].childNodes[j].points = val_min;
                                                grille.childNodes[i].childNodes[j].textContent = val_min;
                                            }
                                        }
                                    }
                                });

maxInput.addEventListener("change", function(event) {
                                    if (tokenCount != 0) { maxInput.value = val_max; return; }
                                    val_max = getInput("val_max");
                                    maxInput.value = val_max;
                                    minInput.max = val_max;
                                    for (var i=0; i < n; ++i)
                                    {
                                        for (var j=0; j < n; ++j)
                                        {
                                            if (grille.childNodes[i].childNodes[j].points > val_max)
                                            {
                                                grille.childNodes[i].childNodes[j].points = val_max;
                                                grille.childNodes[i].childNodes[j].textContent = val_max;
                                            }
                                        }
                                    }
                                });
