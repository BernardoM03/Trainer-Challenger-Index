/*
    Project: Trainer Challenger Index
    Authors: Bernardo Mendes and Gage Davelaar
*/

let updateGymForm = document.getElementById('update-gym-form');

updateGymForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let updateGym = document.getElementById('mySelectGym');
    let updateGymVal = updateGym.value;
    
    let inputName = document.getElementById("update-gym-name");
    let inputType = document.getElementById("update-gym-type");
    let inputRegion = document.getElementById("update-gym-region");

    let inputNameVal = inputName.value;
    let inputTypeVal = inputType.value;
    let inputRegionVal = inputRegion.value;

    let inputData = {
        gym_id: updateGymVal,
        name: inputNameVal,
        type: inputTypeVal,
        region: inputRegionVal
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-gyms", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, updateGymVal);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(inputData));
})

function updateRow(data, gymID) {
    let parsedData = JSON.parse(data);
    //console.log(parsedData[0].trainer_name);
    let table = document.getElementById("gyms-table");

    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        let gymIDCell = row.getElementsByTagName("td")[0];

        if (gymIDCell.innerText == gymID) {
            let name_td = row.getElementsByTagName("td")[1];
            let type_td = row.getElementsByTagName("td")[2];
            let region_td = row.getElementsByTagName("td")[3];

            name_td.innerText = parsedData[0].gym_name;
            type_td.innerText = parsedData[0].type;
            region_td.innerText = parsedData[0].region_name;
            break; 
        }
    }

    location.reload()
}