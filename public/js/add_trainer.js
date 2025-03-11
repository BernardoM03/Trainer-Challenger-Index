let addTrainerForm = document.getElementById("add-trainer-form");

addTrainerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    let inputName = document.getElementById("input-name");
    let inputAge = document.getElementById("input-age");
    let inputRegion = document.getElementById("input-region");

    let inputNameVal = inputName.value;
    let inputAgeVal = inputAge.value;
    let inputRegionVal = inputRegion.value;

    let inputData = {
        name: inputNameVal,
        age: inputAgeVal,
        region: inputRegionVal
    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-trainer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToTable(xhttp.response);
            inputName.value = '';
            inputAge.value = '';
            inputRegion.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };
    
    xhttp.send(JSON.stringify(inputData)); 
});

addRowToTable = (data) => {
    let currentTable = document.getElementById("trainer-table");

    let newRowIndex = currentTable.rows.length;
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let ageCell = document.createElement("TD");
    let regionCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    idCell.innerText = newRow.trainer_id;
    nameCell.innerText = newRow.trainer_name;
    ageCell.innerText = newRow.age;
    regionCell.innerText = newRow.region_name;
    deleteCell.innerHTML = '<a href="/delete_trainer/{{this.trainer_id}}" class="table_button">Delete</a>';


    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(ageCell);
    row.appendChild(regionCell);
    row.appendChild(deleteCell);

    currentTable.appendChild(row);
    console.log("Response Data:", data); // Log the raw response data

    location.reload()
}