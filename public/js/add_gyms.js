/*
    Project: Trainer Challenger Index
    Authors: Bernardo Mendes and Gage Davelaar
*/

let addGymForm = document.getElementById("add-gym-form");

addGymForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let inputGymName = document.getElementById("gym-name");
    let inputGymType = document.getElementById("gym-type");
    let inputGymRegion = document.getElementById("input-add-region");

    let inputNameVal = inputGymName.value;
    let inputTypeVal = inputGymType.value;
    let inputRegionVal = inputGymRegion.value;

    let inputData = {
        name: inputNameVal,
        type: inputTypeVal,
        region: inputRegionVal
    }

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-gym", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToTable(xhttp.response);
            inputGymName.value = '';
            inputGymType.value = '';
            inputGymRegion.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };
    
    xhttp.send(JSON.stringify(inputData)); 

})

addRowToTable = (data) => {
    let currentTable = document.getElementById("gyms-table");

    let newRowIndex = currentTable.rows.length;
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let typeCell = document.createElement("TD");
    let regionCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    idCell.innerText = newRow.gym_id
    nameCell.innerText = newRow.gym_name;
    typeCell.innerText = newRow.type;
    regionCell.innerText = newRow.region_name;
    deleteCell.innerHTML = '<a href="/delete_gyms/{{this.gym_id}}" class="table_button">Delete</a>';

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(typeCell);
    row.appendChild(regionCell);
    row.appendChild(deleteCell);

    currentTable.appendChild(row);
    console.log("Response Data:", data); // Log the raw response data

    location.reload()
}