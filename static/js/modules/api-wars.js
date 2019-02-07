import {fetchData} from "./ajax.js";
import {addCommas} from "./helper-functions.js";


function displayPlanets(response) {

    let nextButton = document.querySelector("#next");
    let prevButton = document.querySelector("#prev");
    setButtonState(nextButton, response.next);
    setButtonState(prevButton, response.previous);

    let planets = response.results;
    let features = ["name", "diameter", "climate", "terrain", "surface_water", "population", "residents"];
    let table = document.querySelector(".planets");

    let thead = createThead(features);
    table.appendChild(thead);

    let tbody = document.createElement("tbody");
    for (let i = 0; i < planets.length; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < features.length; j++) {
            let td = document.createElement("td");
            if (planets[i][features[j]] === "unknown") {
                td.innerText = "unknown";
            } else if (features[j] === "diameter") {
                td.innerText = addCommas(planets[i][features[j]]) + " km";
            } else if (features[j] === "surface_water") {
                td.innerText = planets[i]["surface_water"] + "%";
            } else if (features[j] === "population") {
                td.innerText = addCommas(planets[i][features[j]]);
            } else if (features[j] === "residents") {
                if (planets[i][features[j]].length > 0){
                    let residentsButton = createResidentsButton(td, `${planets[i][features[j]]}`,
                        `${planets[i]["name"]}`);
                    td.appendChild(residentsButton);
                    residentsButton.addEventListener("click", showResidentsOnButtonClick);
                } else {
                    td.innerText = "unknown";
                }
            } else {
                td.innerText = planets[i][features[j]];
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}

function createThead(headings){
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    for (let heading of headings) {
        let th = document.createElement("th");
        heading = heading[0].toUpperCase() + heading.slice(1);
        if (heading.indexOf("_") !== -1){
            heading = heading.slice(0, heading.indexOf("_")) + " " + heading.slice(heading.indexOf("_") + 1);
        }
        th.innerText = heading;
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    return thead
}

function createResidentsButton(td, dataAttr1, dataAttr2){
    let residentsButton = document.createElement("button");
    residentsButton.classList.add("residents-button");
    residentsButton.classList.add("btn");
    residentsButton.classList.add("btn-info");
    residentsButton.setAttribute("data-resident-links", dataAttr1);
    residentsButton.setAttribute("data-planet-name", dataAttr2);
    residentsButton.innerText = "Residents";
    return residentsButton
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

function prepareModal(title, headings){
    let modalTitle = document.querySelector("#modal .modal-title");
    modalTitle.textContent = title;

    let modalBodyTable = document.querySelector("#modal .modal-body table");
    modalBodyTable.innerHTML = "";
    modalBodyTable.classList.add("residents");

    let thead = createThead(headings);
    modalBodyTable.appendChild(thead);

    let tbody = document.createElement("tbody");
    modalBodyTable.appendChild(tbody);
}

function displayResident(resident){
    let features = ["name", "height", "mass", "skin_color", "hair_color", "eye_color", "birth_year", "gender"];
    let modalBodyTableTbody = document.querySelector("#modal .modal-body table tbody");
    let tr = document.createElement("tr");
    for (let i = 0; i < features.length; i++){
        let td = document.createElement("td");
        if (resident[features[i]] === "unknown") {
            td.innerText = "unknown";
        }
        else if (features[i] === "height"){
            td.innerText = `${parseInt(resident[features[i]]) / 100} m`;
        }
        else if (features[i] === "mass"){
            td.innerText = `${resident[features[i]]} kg`;
        }
        else if (features[i] === "gender"){
            if (resident["gender"] === "male"){
                td.innerHTML = '<i class="fas fa-mars"></i>';
            }
            else if (resident["gender"] === "female"){
                td.innerHTML = '<i class="fas fa-venus"></i>';
            } else {
                td.innerHTML = '<i class="fas fa-transgender"></i>';
            }
        } else {
            td.innerText = resident[features[i]];
        }
        tr.appendChild(td);
    }
    modalBodyTableTbody.appendChild(tr);
    $('#modal').modal();
}

function showResidentsOnButtonClick(event){
    let button = event.currentTarget;
    let links = button.dataset.residentLinks;
    let residentLinks = links.split(",");
    let planetName = button.dataset.planetName;
    let title = `Residents of ${planetName}`;
    let features = ["name", "height", "mass", "skin_color", "hair_color", "eye_color", "birth_year", "gender"];
    prepareModal(title, features);
    for (let resident of residentLinks){
        fetchData(resident, displayResident)
    }
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