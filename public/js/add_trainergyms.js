/*
    Project: Trainer Challenger Index
    Authors: Bernardo Mendes and Gage Davelaar
*/

let addTrainerGymForm = document.getElementById("add-trainergym-form");

addTrainerGymForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let inputTrainerGymName = document.getElementById("trainergym-name");
    let inputTrainerGymGym = document.getElementById("trainergym-gym");
    let inputTrainerGymTrainer = document.getElementById("trainergym-trainer");
    let inputTrainerGymDate = document.getElementById("trainergym-date");

    let inputTrainerGymNameVal = inputTrainerGymName.value;
    let inputTrainerGymGymVal = inputTrainerGymGym.value;
    let inputTrainerGymTrainerVal = inputTrainerGymTrainer.value;
    let inputTrainerGymDateVal = inputTrainerGymDate.value;

    let inputData = {
        name: inputTrainerGymNameVal,
        gym: inputTrainerGymGymVal,
        trainer: inputTrainerGymTrainerVal,
        date: inputTrainerGymDateVal
    }

    console.log(inputData);

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-trainergym", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToTable(xhttp.response);
            inputTrainerGymName.value = '';
            inputTrainerGymGym.value = '';
            inputTrainerGymTrainer.value = '';
            inputTrainerGymDate.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };
    
    xhttp.send(JSON.stringify(inputData)); 

})

addRowToTable = (data) => {
    let currentTable = document.getElementById("trainergyms-table");

    let newRowIndex = currentTable.rows.length;
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    let trainerIdCell = document.createElement("TD");
    let gymIdCell = document.createElement("TD");
    let trainernameCell = document.createElement("TD");
    let badgenameCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    let dateEarned = new Date(newRow.date_earned).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    trainerIdCell.innerText = newRow.trainer_id;
    gymIdCell.innerText = newRow.gym_id;
    trainernameCell.innerText = newRow.trainer_name;
    badgenameCell.innerText = newRow.badge_name;
    dateCell.innerText = dateEarned;
    deleteCell.innerHTML = '<a href="/delete_trainerGym/{{this.trainer_id}}/{{this.gym_id}}" class="table_button">Delete</a>';

    row.appendChild(trainerIdCell);
    row.appendChild(gymIdCell);
    row.appendChild(trainernameCell);
    row.appendChild(badgenameCell);
    row.appendChild(dateCell);
    row.appendChild(deleteCell);

    currentTable.appendChild(row);
    console.log("Response Data:", data); // Log the raw response data

    location.reload()
}