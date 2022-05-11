let tokenColor = "lightcoral";
let tokenLightColor = "lightpink";

let score = 0;
let tokenCount = 0;

let n = 4;
let x = 4;
let p = 10;
let val_min = -9 ;
let val_max = 9 ;

let points = [[-6, 9, -2, 5, 0],
                [8, 2, -7, -6, 0],
                [-8, 2, -4, -3, 0],
                [-3, 3, -4, 7, 0],
                [0, 0, 0, 0, 0]
            ];

let contenu;    // Stores document's "contenu" div
let scorePar;
let nbTokenPar;
let controle;

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

function createTable()
{
    var tbl = document.createElement("table");
    tbl.id = "grille";

    for (var i = 0; i < n; i++)
    {
        var row = document.createElement("tr");

        for (var j = 0; j < n; j++)
        {
            var cell = document.createElement("td");
            var cellText = document.createTextNode(points[i][j]);
            cell.appendChild(cellText);
            row.appendChild(cell);

            cell.addEventListener("click", switchToken);
            cell.addEventListener("mouseover", function(event) {
                                                    if (event.target.taken)
                                                        event.target.style.backgroundColor = tokenLightColor;
                                                    else
                                                        event.target.style.backgroundColor = "lightgray";
                                                });
            cell.addEventListener("mouseleave", function(event) {
                                                    if (event.target.taken)
                                                        event.target.style.backgroundColor = tokenColor;
                                                    else
                                                        event.target.style.backgroundColor = "white";
                                                });
            cell.addEventListener("wheel", function(event) {
                                                if (tokenCount==0)
                                                {
                                                    var range = val_max - val_min + 1;
                                                    event.target.points += -val_min - event.deltaY / Math.abs(event.deltaY) + range;
                                                    event.target.points = (event.target.points % range) + val_min;
                                                    event.target.textContent = event.target.points;
                                                }
                                            });
            cell.style.backgroundColor = "white";
            cell.points = points[i][j];
            cell.pos = i * n + j;
            cell.taken = false;

            var cellSize = 6;
            cell.style.maxWidth = cellSize + "em";
            cell.style.maxHeight = cellSize + "em";
            cell.style.minWidth = cellSize + "em";
            cell.style.minHeight = cellSize + "em";
        }

        tbl.appendChild(row);
    }

    var tblSize = n * cellSize;
    tbl.style.maxWidth = tblSize + "em";
    tbl.style.maxHeight = tblSize + "em";
    tbl.style.minWidth = tblSize + "em";
    tbl.style.minHeight = tblSize + "em";

    contenu.appendChild(tbl);

    scorePar.textContent = "Score : 0";
    nbTokenPar.textContent = "Jetons restants : "+x;
}

function generateTable()
{
    n = getInput("n");
    document.getElementById("x").max = n * n;
    document.getElementById("x").defaultValue = n;
    x = getInput("x");
    p = getInput("p");
    val_min = getInput("val_min");
    val_max = getInput("val_max");

    document.getElementById("n").value = n;
    document.getElementById("x").value = x;
    document.getElementById("p").value = p;
    document.getElementById("val_min").value = val_min;
    document.getElementById("val_max").value = val_max;

    console.log(typeof(n), typeof(x), typeof(p));
    console.log(n, x, p);

    contenu.removeChild(document.getElementById("grille"));

    tokenCount = 0;
    score = 0;

    generatePoints();
    createTable();
}

contenu = document.getElementsByClassName("contenu")[0];
controle = document.getElementsByClassName("controle")[0];

scorePar = document.createElement("p");
nbTokenPar = document.createElement("p");

controle.appendChild(scorePar);
controle.appendChild(nbTokenPar);

createTable();

document.getElementById("n").defaultValue = 4;
document.getElementById("x").defaultValue = 4;
document.getElementById("p").defaultValue = 10;

document.getElementById("n").value = 4;
document.getElementById("x").value = 4;
document.getElementById("p").value = 10;