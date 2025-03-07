function openAddModal() {
    document.getElementById("add-trainer-modal").style.display = "block";
}

function closeAddModal() {
    document.getElementById("add-trainer-modal").style.display = "none";
}

function openUpdateModal() {
    document.getElementById("update-trainer-modal").style.display = "block";
}

function closeUpdateModal() {
    document.getElementById("update-trainer-modal").style.display = "none";
}


function setupUpdateButton(trainer_id) {
    
    openModal();
}

function confirmDeletion(trainer_id) {
    if (confirm("Are you sure you want to delete this trainer?")) {
        window.location.href = "/delete_trainer/" + trainer_id;
    }
}

