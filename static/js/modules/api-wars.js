import {fetchData, sendData, spin} from "./ajax.js";
import {addCommas, createThead, createButton, setButtonState, prepareModal} from "./helper-functions.js";


function displayPlanets(response) {

    let nextButton = document.querySelector("#next");
    let prevButton = document.querySelector("#prev");
    setButtonState(nextButton, response.next);
    setButtonState(prevButton, response.previous);

    let planets = response.results;

    let table = document.querySelector(".planets");
    let loginStatus = table.dataset.loginStatus;

    let features = ["name", "diameter", "climate", "terrain", "surface_water", "population", "residents"];
    if (loginStatus === "logged-in"){
        features = ["name", "diameter", "climate", "terrain", "surface_water", "population", "residents", " "];
    }

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
                if (planets[i][features[j]].length > 0) {
                    let buttonDataAttributes = [
                        {name: "data-resident-links", value: `${planets[i][features[j]]}`},
                        {name: "data-planet-name", value: `${planets[i]["name"]}`}
                    ];
                    let residentsButton = createButton(["btn", "new-btn-info", "text-light", "residents-button"],
                        buttonDataAttributes, `${planets[i][features[j]].length} resident(s)`);
                    td.appendChild(residentsButton);
                    residentsButton.addEventListener("click", showResidentsOnButtonClick);
                } else {
                    td.innerText = "no known residents";
                }
            }
            else if (features[j] === " "){
                let planetLink = planets[i]["url"].split("/");
                let buttonDataAttributes = [
                    {name: "data-planet-id", value: planetLink[planetLink.length-2]},
                    {name: "data-planet-name", value: `${planets[i]["name"]}`},
                    {name: "data-user-id", value: table.dataset.userId},
                ];
                let voteButton = createButton(["btn", "new-btn-secondary", "text-light"],
                    buttonDataAttributes, "Vote!");
                td.appendChild(voteButton);
                voteButton.addEventListener("click", savePlanetVote);
            } else {
                td.innerText = planets[i][features[j]];
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
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
    prepareModal("large", title, true, features, "");
    for (let resident of residentLinks){
        fetchData(resident, displayResident)
    }
}


function savePlanetVote(event){
    let button = event.currentTarget;
    let data = {
        planet_id: parseInt(button.dataset.planetId),
        planet_name: button.dataset.planetName,
        user_id: parseInt(button.dataset.userId)
    };
    let jsonData = JSON.stringify(data);
    sendData('/save-vote', jsonData, sendSuccessMessage)
}


function sendSuccessMessage(){
    let message = `<i class="fas fa-thumbs-up"></i> Your vote has been saved.`;
    prepareModal("small", "Success!", false, "", message);
    $('#modal').modal();
}


function displayVotedPlanets(planets){
    let headings = ["planet_name", "received_votes"];
    prepareModal("small", "Planets voted for", true, headings, "");
    let modalBodyTableTbody = document.querySelector("#modal .modal-body table tbody");
    for (let i = 0; i < planets.length; i++){
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.innerText = planets[i]["planet_name"];
        tr.appendChild(td1);
        let td2 = document.createElement("td");
        td2.innerText = planets[i]["received_votes"];
        tr.appendChild(td2);
        modalBodyTableTbody.appendChild(tr);
    }
    $('#modal').modal();
}


function main(){
    sessionStorage.setItem("page", "1");

    let nextButton = document.querySelector("#next");
    let prevButton = document.querySelector("#prev");
    showNextOrPrev(nextButton, 1);
    showNextOrPrev(prevButton, -1);

    let linkButton = document.querySelector("#voted-planets");
    linkButton.addEventListener("click", function (ev) {
        fetchData('/voted-planets', displayVotedPlanets);
    });

    spin();
    fetchData(`https://swapi.co/api/planets/?page=1`, displayPlanets);

}
main();