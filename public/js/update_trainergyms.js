/*
    Project: Trainer Challenger Index
    Authors: Bernardo Mendes and Gage Davelaar
*/

let updateTrainergymForm = document.getElementById('update-trainergym-form');

updateTrainergymForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let updateTrainergym = document.getElementById('mySelectTrainergym').value.split('-');
    let updateTrainerID = updateTrainergym[0];
    let updateGymID = updateTrainergym[1];
    
    let inputBadgeName = document.getElementById("update-trainergym-badgename");
    let inputGym = document.getElementById("update-trainergym-gym");
    let inputTrainer = document.getElementById("update-trainergym-trainer");
    let inputDate = document.getElementById("update-trainergym-date");

    let inputBagdeNameVal = inputBadgeName.value;
    let inputGymVal = inputGym.value;
    let inputTrainerVal = inputTrainer.value;
    let inputDateVal = inputDate.value;

    let inputData = {
        trainer_id: updateTrainerID,
        gym_id: updateGymID,
        badge_name: inputBagdeNameVal,
        gym: inputGymVal,
        trainer: inputTrainerVal,
        date: inputDateVal
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-trainergyms", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, updateTrainerID, updateGymID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(inputData));
})

function updateRow(data, trainerID, gymID) {
    let parsedData = JSON.parse(data);

    if (!parsedData || parsedData.length === 0) {
        console.error("No data returned from the server.");
        return;
    }

    let table = document.getElementById("trainergyms-table");

    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        let trainerIDCell = row.getElementsByTagName("td")[0];
        let gymIDCell = row.getElementsByTagName("td")[1];

        if (trainerIDCell.innerText == trainerID && gymIDCell.innerText == gymID) {
            let trainer_td = row.getElementsByTagName("td")[2];
            let badgename_td = row.getElementsByTagName("td")[3];
            let date_td = row.getElementsByTagName("td")[4];

            trainer_td.innerText = parsedData[0].trainer_name;
            badgename_td.innerText = parsedData[0].badge_name;
            date_td.innerText = parsedData[0].date;
            break; 
        }
    }

    location.reload();
}
