import {fetchData} from "./ajax.js";
import {addCommas} from "./helper-functions.js";


function displayPlanets(response){
    let planets = response.results;
    let features = ["name", "diameter", "climate", "terrain", "surface_water", "population"];
    let table = document.querySelector(".planets");
    let tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbody");
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
        tbody.appendChild(tr);
    }
    table.innerHTML = createThead();
    table.appendChild(tbody);


    let nextButton = document.querySelector("#next");
    let prevButton = document.querySelector("#prev");

    if(response.next){
        nextButton.removeAttribute("disabled");
    } else {
        nextButton.setAttribute("disabled", "disabled");
    }

    if (response.previous){
        prevButton.removeAttribute("disabled");
    } else {
        prevButton.setAttribute("disabled", "disabled");
    }
}

function createThead(){
    return `
        <thead>
            <tr>
                <th>Name</th>
                <th>Diameter</th>
                <th>Climate</th>
                <th>Terrain</th>
                <th>Surface water</th>
                <th>Population</th>
            </tr>
        </thead>
    `
}

function showNextOrPrev(button, num){
    let table = document.querySelector(".planets");
    button.addEventListener("click", function(){
        let page = parseInt(table.dataset.page);
        table.dataset.page = `${page + num}`;
        let newPage = table.dataset.page;
        table.innerHTML = "";
        fetchData(`https://swapi.co/api/planets/?page=${newPage}`, displayPlanets);
    });
}


function main(){
    let nextButton = document.querySelector("#next");
    let prevButton = document.querySelector("#prev");
    showNextOrPrev(nextButton, 1);
    showNextOrPrev(prevButton, -1);

    fetchData(`https://swapi.co/api/planets/?page=1`, displayPlanets);
}
main();