let tokenColor = "lightcoral";
let tokenLightColor = "lightpink";

let score = 0;
let tokenCount = 0;

let n = 4;
let x = 4;
let p = 10;

let points = [[-6, 9, -2, 5],
                [8, 2, -7, -6],
                [-8, 2, -4, -3],
                [-3, 3, -4, 7]
            ];

let contenu;    // Stores document's "contenu" div
let scorePar;
let nbTokenPar;

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

function create_table()
{
    var tbl = document.createElement("table");

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
            cell.style.backgroundColor = "white";
            cell.points = points[i][j];
            cell.pos = i * n + j;
            cell.taken = false;

            var cellSize = "10em";
            cell.style.maxWidth = cellSize;
            cell.style.maxHeight = cellSize;
            cell.style.minWidth = cellSize;
            cell.style.minHeight = cellSize;
        }

        tbl.appendChild(row);
    }

    var tblSize = "40em";
    tbl.style.maxWidth = tblSize;
    tbl.style.maxHeight = tblSize;
    tbl.style.minWidth = tblSize;
    tbl.style.minHeight = tblSize;

    contenu.appendChild(tbl);
}

contenu = document.getElementsByClassName("contenu")[0];

scorePar = document.createElement("p");
nbTokenPar = document.createElement("p");

scorePar.textContent = "Score : 0";
nbTokenPar.textContent = "Jetons restants : "+x;

create_table();

var controle = document.getElementsByClassName("controle")[0];

controle.appendChild(scorePar);
controle.appendChild(nbTokenPar);