/*
    Project: Trainer Challenger Index
    Authors: Bernardo Mendes and Gage Davelaar
*/

let addRegionForm = document.getElementById("add-region-form");

addRegionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let inputName = document.getElementById("region-name");

    let inputNameVal = inputName.value;
    let inputData = {
        name: inputNameVal
    }

    console.log(inputData);

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-regions", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToTable(xhttp.response);
            inputName.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };
    
    xhttp.send(JSON.stringify(inputData)); 

})

addRowToTable = (data) => {
    let currentTable = document.getElementById("regions-table");

    let newRowIndex = currentTable.rows.length;
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    idCell.innerText = newRow.region_id;
    nameCell.innerText = newRow.name;
    deleteCell.innerHTML = '<a href="/delete_regions/{{this.region_id}}" class="table_button">Delete</a>';


    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(deleteCell);

    currentTable.appendChild(row);
    console.log("Response Data:", data); // Log the raw response data

    location.reload()
}