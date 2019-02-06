import {fetchData} from "./ajax.js";
import {addCommas} from "./helper-functions.js";


function displayPlanets(planets){
    let features = ["name", "diameter", "climate", "terrain", "surface_water", "population"];
    let table = document.querySelector(".planets");
    for (let i = 0; i < planets.length; i++){
        let tr = document.createElement("tr");
        for (let j = 0; j < features.length; j++){
            let td = document.createElement("td");
            if (planets[i][features[j]] === "unknown"){
                td.innerText = "unknown"
            }
            else if (features[j] === "diameter"){
                td.innerText = addCommas(planets[i][features[j]]) + " km";
            }
            else if (features[j] === "surface_water") {
                td.innerText = planets[i][features[j]] + "%";
            }
            else if (features[j] === "population"){
                td.innerText = addCommas(planets[i][features[j]]);
            }
            else {
                td.innerText = planets[i][features[j]];
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

fetchData('https://swapi.co/api/planets', displayPlanets);
