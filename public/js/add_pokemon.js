let addPokemonForm = document.getElementById("add-pokemon-form");

addPokemonForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let inputName = document.getElementById("pokemon-name");
    let inputType = document.getElementById("pokemon-type");
    let inputRegion = document.getElementById("pokemon-region");
    let inputTrainer = document.getElementById("pokemon-trainer");

    let inputNameVal = inputName.value;
    let inputTypeVal = inputType.value;
    let inputRegionVal = inputRegion.value;
    let inputTrainerVal = inputTrainer.value;

    let inputData = {
        name: inputNameVal,
        type: inputTypeVal,
        region: inputRegionVal,
        trainer: inputTrainerVal
    }

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-pokemon", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToTable(xhttp.response);
            inputName.value = '';
            inputType.value = '';
            inputRegion.value = '';
            inputTrainer.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };
    
    xhttp.send(JSON.stringify(inputData)); 

})

addRowToTable = (data) => {
    let currentTable = document.getElementById("pokemon-table");

    let newRowIndex = currentTable.rows.length;
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let typeCell = document.createElement("TD");
    let regionCell = document.createElement("TD");
    let trainerCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    idCell.innerText = newRow.pokemon_id
    nameCell.innerText = newRow.pokemon_name;
    typeCell.innerText = newRow.type;
    regionCell.innerText = newRow.region_name;
    trainerCell.innerText = newRow.trainer_name;
    deleteCell.innerHTML = '<a href="/delete_pokemon/{{this.pokemon_id}}" class="table_button">Delete</a>';

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(typeCell);
    row.appendChild(regionCell);
    row.appendChild(trainerCell)
    row.appendChild(deleteCell);

    currentTable.appendChild(row);
    console.log("Response Data:", data); // Log the raw response data

    location.reload()
}