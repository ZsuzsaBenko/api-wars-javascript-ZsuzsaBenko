

function fetchData(func){
    fetch('https://swapi.co/api/planets')
    .then((response) => response.json())
    .then((data) => {
        func(data.results);
    });
}

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

fetchData(displayPlanets);


function addCommas(numString){
    let digits = Array.from(numString);
    for (let i = digits.length; i >= 0; i = i-3){
        digits.splice(i, 0, ",");
    }
    let newNumString = digits.join("");
    if (newNumString.startsWith(",") && newNumString.endsWith(",")){
        return newNumString.slice(1, -1);
    }
    else {
        return newNumString.slice(0, -1);
    }
}