import {fetchData} from "./ajax.js";
import {addCommas} from "./helper-functions.js";


function displayPlanets(response) {

    let nextButton = document.querySelector("#next");
    let prevButton = document.querySelector("#prev");
    setButtonState(nextButton, response.next);
    setButtonState(prevButton, response.previous);

    let planets = response.results;
    let features = ["name", "diameter", "climate", "terrain", "surface water", "population", "residents"];
    let table = document.querySelector(".planets");

    let thead = document.createElement("thead");
    for (let feature of features) {
        let th = document.createElement("th");
        feature = feature[0].toUpperCase() + feature.slice(1);
        th.innerText = feature;
        thead.appendChild(th);
    }
    table.appendChild(thead);

    let tbody = document.createElement("tbody");
    for (let i = 0; i < planets.length; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < features.length; j++) {
            let td = document.createElement("td");
            if (planets[i][features[j]] === "unknown") {
                td.innerText = "unknown"
            } else if (features[j] === "diameter") {
                td.innerText = addCommas(planets[i][features[j]]) + " km";
            } else if (features[j] === "surface water") {
                td.innerText = planets[i]["surface_water"] + "%";
            } else if (features[j] === "population") {
                td.innerText = addCommas(planets[i][features[j]]);
            } else if (features[j] === "residents") {
                td.innerText = "residents";
            } else {
                td.innerText = planets[i][features[j]];
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}



function setButtonState(button, condition) {
    if (condition) {
        button.removeAttribute("disabled");
    } else {
        button.setAttribute("disabled", "disabled");
    }
}


function showNextOrPrev(button, num){
    let table = document.querySelector(".planets");
    button.addEventListener("click", function(){
        let page = sessionStorage.getItem("page");
        sessionStorage.setItem("page", `${parseInt(page) + num}`);
        page = sessionStorage.getItem("page");
        table.innerHTML = "";
        fetchData(`https://swapi.co/api/planets/?page=${page}`, displayPlanets);
    });
}


function main(){
    sessionStorage.setItem("page", "1");
    let nextButton = document.querySelector("#next");
    let prevButton = document.querySelector("#prev");
    showNextOrPrev(nextButton, 1);
    showNextOrPrev(prevButton, -1);

    fetchData(`https://swapi.co/api/planets/?page=1`, displayPlanets);
}
main();