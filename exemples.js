import { data } from "./data.js";

function cree_grille(n, valeurs, cell)
{
    var grille = document.createElement("table");
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

function cree_exemple(probleme)
{
    var table = document.createElement("table");

    var enTete = document.createElement("th");
    enTete.colSpan = "4";
    enTete.textContent = "Problème " + probleme.nom;
    table.appendChild(document.createElement("tr"));
    table.childNodes[0].appendChild(enTete);

    for (var i=0; i < 3; ++i) table.appendChild(document.createElement("tr"));

    for (var i=0; i < 4; ++i) table.childNodes[1].appendChild(document.createElement("td"));
    var parametres = [probleme.n, probleme.x, probleme.p];
    for (var i=0; i < 3; ++i)
    {
        table.childNodes[1].childNodes[i].className = "parametres";
        table.childNodes[1].childNodes[i].textContent = parametres[i];
    }
    table.childNodes[1].childNodes[3].className = "solution";
    table.childNodes[1].childNodes[3].rowSpan = "2";
    table.childNodes[1].childNodes[3].textContent = probleme.solution.join(" ");

    table.childNodes[2].appendChild(document.createElement("td"));
    table.childNodes[2].childNodes[0].className = "instance";
    table.childNodes[2].childNodes[0].rowSpan = "2";
    table.childNodes[2].childNodes[0].colSpan = "3";
    cree_grille(probleme.n, probleme.grille, table.childNodes[2].childNodes[0]);

    table.childNodes[3].appendChild(document.createElement("td"));
    table.childNodes[3].childNodes[0].className = "score";
    table.childNodes[3].childNodes[0].textContent = probleme.score;

    for (var i=0; i < probleme.x; ++i)
    {
        var pos = probleme.solution[i] - 1;
        var x = pos % probleme.n;
        var y = Math.floor(pos / probleme.n);
        table.childNodes[2].childNodes[0].childNodes[0].childNodes[y].childNodes[x].className = "jeton";
    }

    document.getElementById("contenu").appendChild(table);
}

for (var i=0; i < data.length; ++i) cree_exemple(data[i]);