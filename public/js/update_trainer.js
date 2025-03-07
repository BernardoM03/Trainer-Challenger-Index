let updateTrainerForm = document.getElementById('update-trainer-form');

updateTrainerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let updateTrainer = document.getElementById('mySelectTrainer');
    let updateTrainerVal = updateTrainer.value;
    
    let inputName = document.getElementById("input-update-name");
    let inputAge = document.getElementById("input-update-age");
    let inputRegion = document.getElementById("input-update-region");

    let inputNameVal = inputName.value;
    let inputAgeVal = inputAge.value;
    let inputRegionVal = inputRegion.value;

    console.log("Input Values:", {
        trainer_id: updateTrainerVal,
        name: inputNameVal,
        age: inputAgeVal,
        region: inputRegionVal
    });

    let inputData = {
        trainer_id: updateTrainerVal, // Add trainer_id here
        name: inputNameVal,
        age: inputAgeVal,
        region: inputRegionVal
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-trainer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, updateTrainerVal);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(inputData));
})

function updateRow(data, trainerID) {
    let parsedData = JSON.parse(data);
    //console.log(parsedData[0].trainer_name);
    let table = document.getElementById("trainer-table");

    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        let trainerIDCell = row.getElementsByTagName("td")[0];

        if (trainerIDCell.innerText == trainerID) {
            let name_td = row.getElementsByTagName("td")[1];
            let age_td = row.getElementsByTagName("td")[2];
            let region_td = row.getElementsByTagName("td")[3];

            name_td.innerText = parsedData[0].trainer_name;
            age_td.innerText = parsedData[0].age;
            region_td.innerText = parsedData[0].region_name;
            break; 
        }
    }
}