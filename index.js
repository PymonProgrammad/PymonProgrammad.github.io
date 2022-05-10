var n = 4;
var x = 4;
var p = 10;

var points = [[-6, 9, -2, 5],
                [8, 2, -7, -6],
                [-8, 2, -4, -3],
                [-3, 3, -4, 7]
            ]

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
    }

    tbl.appendChild(row);
}

contenu.appendChild(tbl);