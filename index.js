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
            ]


function switchToken(event)
{
    var token = event.target;
    if (token.style.backgroundColor == tokenLightColor || token.style.backgroundColor == tokenColor)
    {
        token.style.backgroundColor = "white";
        score -= token.points;
        --tokenCount;
    }
    else if (tokenCount < x)
    {
        token.style.backgroundColor = tokenColor;
        score += token.points;
        ++tokenCount;
    }
    console.log(score, tokenCount);
}

var contenu = document.getElementsByClassName("contenu")[0];

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
    }

    tbl.appendChild(row);
}

contenu.appendChild(tbl);