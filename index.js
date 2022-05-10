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
            if (otherCell.pos != cell.pos && (otherCell.style.backgroundColor == tokenColor || otherCell.style.backgroundColor == tokenLightColor))
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
    if (token.style.backgroundColor == tokenLightColor || token.style.backgroundColor == tokenColor)
    {
        score -= token.points;
        score += nbConflicts(token) * p;
        --tokenCount;
        token.style.backgroundColor = "white";
    }
    else if (tokenCount < x)
    {
        score += token.points;
        score -= nbConflicts(token) * p;
        ++tokenCount;
        token.style.backgroundColor = tokenColor;
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
                                                    if (event.target.style.backgroundColor == tokenColor)
                                                        event.target.style.backgroundColor = tokenLightColor;
                                                    if (event.target.style.backgroundColor == "white")
                                                        event.target.style.backgroundColor = "lightgray";
                                                });
            cell.addEventListener("mouseleave", function(event) {
                                                    if (event.target.style.backgroundColor == tokenLightColor)
                                                        event.target.style.backgroundColor = tokenColor;
                                                    if (event.target.style.backgroundColor == "lightgray")
                                                        event.target.style.backgroundColor = "white";
                                                });
            cell.style.backgroundColor = "white";
            cell.points = points[i][j];
            cell.pos = i * n + j;
        }

        tbl.appendChild(row);
    }

    contenu.appendChild(tbl);
}

contenu = document.getElementsByClassName("contenu")[0];

scorePar = document.createElement("p");
nbTokenPar = document.createElement("p");

scorePar.textContent = "Score : 0";
nbTokenPar.textContent = "Jetons restants : "+x;

create_table();

contenu.appendChild(scorePar);
contenu.appendChild(nbTokenPar);