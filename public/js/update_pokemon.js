/*
    Project: Trainer Challenger Index
    Authors: Bernardo Mendes and Gage Davelaar
*/

let updatePokemonForm = document.getElementById('update-pokemon-form');

updatePokemonForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let updatePokemon = document.getElementById('mySelectPokemon');
    let updatePokemonVal = updatePokemon.value;
    
    let inputName = document.getElementById("update-pokemon-name");
    let inputType = document.getElementById("update-pokemon-type");
    let inputRegion = document.getElementById("update-pokemon-region");
    let inputTrainer = document.getElementById("update-pokemon-trainer");

    let inputNameVal = inputName.value;
    let inputTypeVal = inputType.value;
    let inputRegionVal = inputRegion.value;
    let inputTrainerVal = inputTrainer.value;

    let inputData = {
        pokemon_id: updatePokemonVal,
        name: inputNameVal,
        type: inputTypeVal,
        region: inputRegionVal,
        trainer: inputTrainerVal
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-pokemon", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, updatePokemonVal);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(inputData));
})

function updateRow(data, pokemonID) {
    let parsedData = JSON.parse(data);
    //console.log(parsedData[0].trainer_name);
    let table = document.getElementById("pokemon-table");

    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        let pokemonIDCell = row.getElementsByTagName("td")[0];

        if (pokemonIDCell.innerText == pokemonID) {
            let name_td = row.getElementsByTagName("td")[1];
            let type_td = row.getElementsByTagName("td")[2];
            let region_td = row.getElementsByTagName("td")[3];
            let trainer_td = row.getElementsByTagName("td")[4];

            name_td.innerText = parsedData[0].pokemon_name;
            type_td.innerText = parsedData[0].type;
            region_td.innerText = parsedData[0].region_name;
            trainer_td.innerText = parsedData[0].trainer_name;
            break; 
        }
    }

    location.reload()
}