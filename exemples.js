function cree_grille(n, valeurs, cell)
{
    grille = document.createElement("table");
    for (var i=0; i < n; ++i)
    {
        var rangee = document.createElement("tr");
        for (var j=0; j < n; ++j)
        {
            var cellule = document.createElement("td");
            var contenu = document.createElement("div");
            contenu.className = "content";
            var pseudoTable = document.createElement("div");
            pseudoTable.className = "table";
            var pseudoCell = document.createElement("div");
            pseudoCell.className = "cell";
            pseudoCell.textContent = valeurs[i][j];
            pseudoTable.appendChild(pseudoCell);
            contenu.appendChild(pseudoTable);
            cellule.appendChild(contenu);
            rangee.appendChild(cellule);
        }
        grille.appendChild(rangee);
    }
    cell.appendChild(grille);
}

var instance4a = document.getElementsByClassName("instance")[0];
cree_grille(4, [[-6, 9, -2, 5],
    [8, 2, -7, -6],
    [-8, 2, -4, -3],
    [-3, 3, -4, 7]],
    instance4a);