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

    /*let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    for (let feature of features) {
        let th = document.createElement("th");
        feature = feature[0].toUpperCase() + feature.slice(1);
        th.innerText = feature;
        tr.appendChild(th);
    }
    thead.appendChild(tr);*/
    let thead = createThead(features);
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
                if (planets[i][features[j]].length > 0){
                    createResidentsButton(td, planets, i, j, features)
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
        th.innerText = heading;
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    return thead
}

function createResidentsButton(td, planets, i, j, features){
    let residentsButton = document.createElement("button");
    residentsButton.classList.add("residents-button");
    residentsButton.classList.add("btn");
    residentsButton.classList.add("btn-info");
    residentsButton.setAttribute("data-resident-links", `${planets[i][features[j]]}`);
    residentsButton.setAttribute("data-planet-name", `${planets[i]["name"]}`);
    residentsButton.innerText = "Residents";
    td.appendChild(residentsButton);
    residentsButton.addEventListener("click", showResidents);
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
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    for (let i = 0; i < headings.length; i++){
        let th = document.createElement("th");
        th.innerText = headings[i];
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    modalBodyTable.appendChild(thead);

    let tbody = document.createElement("tbody");
    modalBodyTable.appendChild(tbody);
}

function displayResidents(resident){
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

function showResidents(event){
    let button = event.currentTarget;
    let links = button.dataset.residentLinks;
    let residentLinks = links.split(",");
    let planetName = button.dataset.planetName;
    let title = `Residents of ${planetName}`;
    let headings = ["Name", "Height", "Mass", "Skin color", "Hair color", "Eye color", "Birth year", "Gender"];
    prepareModal(title, headings);
    for (let resident of residentLinks){
        fetchData(resident, displayResidents)
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