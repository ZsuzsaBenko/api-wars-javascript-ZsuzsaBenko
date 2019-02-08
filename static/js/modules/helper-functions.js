// general


export function addCommas(numString){
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


// for DOM-manipulation


export function createThead(headings){
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


export function createButton(classes, dataAttributes, text){
    let newButton = document.createElement("button");
    for (let i = 0; i < classes.length; i++){
        newButton.classList.add(classes[i]);
    }
    for (let i = 0; i < dataAttributes.length; i++){
        newButton.setAttribute(dataAttributes[i].name, dataAttributes[i].value);
    }
    newButton.innerText = text;
    return newButton
}


export function setButtonState(button, condition) {
    if (condition) {
        button.removeAttribute("disabled");
    } else {
        button.setAttribute("disabled", "disabled");
    }
}

export function prepareModal(size, title, hasTable, headings, message){
    let modalDialog = document.querySelector(".modal-dialog");
    if (size === "small"){
        modalDialog.classList.remove("modal-xl");
    } else {
        modalDialog.classList.add("modal-xl");
    }

    let modalTitle = document.querySelector("#modal .modal-title");
    modalTitle.textContent = title;

    let modalMessage = document.getElementById("modal-message");
    let modalBodyTable = document.querySelector("#modal .modal-body table");

    if (hasTable){
        modalMessage.innerHTML = "";
        modalBodyTable.innerHTML = "";
        modalBodyTable.classList.add("residents");

        let thead = createThead(headings);
        modalBodyTable.appendChild(thead);

        let tbody = document.createElement("tbody");
        modalBodyTable.appendChild(tbody);
    } else {
        modalBodyTable.innerHTML = message;
    }
}