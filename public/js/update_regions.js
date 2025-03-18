/*
    Project: Trainer Challenger Index
    Authors: Bernardo Mendes and Gage Davelaar
*/

let updateRegionForm = document.getElementById('update-region-form');

updateRegionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let updateRegion = document.getElementById('mySelectRegion');
    let updateRegionVal = updateRegion.value;
    
    let inputName = document.getElementById("update-region-name");
    let inputNameVal = inputName.value;

    let inputData = {
        region_id: updateRegionVal,
        name: inputNameVal
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-regions", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, updateRegionVal);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(inputData));
})

function updateRow(data, regionID) {
    let parsedData = JSON.parse(data);
    //console.log(parsedData[0].trainer_name);
    let table = document.getElementById("regions-table");

    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        let regionIDCell = row.getElementsByTagName("td")[0];

        if (regionIDCell.innerText == regionID) {
            let name_td = row.getElementsByTagName("td")[1];

            name_td.innerText = parsedData[0].name;
            break; 
        }
    }

    location.reload()
}