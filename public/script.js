const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("task-list");
document.getElementById("add-btn").addEventListener("click", addTask);

function addTask() {
    const taskText = inputBox.value.trim();
    if (taskText === "") {
        alert("You must write something!");
    } else {
        const taskItem = createTaskElement(taskText);
        listContainer.append(taskItem);
        inputBox.value = "";
        saveData();
    }
}

function createTaskElement(taskText, checked = false) {
    // Create the item
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    // Create the text span
    const taskTextSpan = document.createElement("span");
    taskTextSpan.textContent = taskText;
    taskTextSpan.className = "task-text";
    if (checked) {
        taskItem.classList.add("checked");
        taskTextSpan.classList.add("checked");
    }
    taskItem.appendChild(taskTextSpan);

    // Create a div to hold action buttons
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", function () {
        taskItem.remove();
        saveData();
    });
    actionsDiv.appendChild(deleteButton);

    // Create edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    actionsDiv.appendChild(editButton);

    // Create save button (initially hidden)
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.className = "save-btn";
    saveButton.style.display = "none";
    actionsDiv.appendChild(saveButton);

    // Add event listener to the edit button
    editButton.addEventListener("click", function () {
        editTask(taskItem, taskTextSpan, editButton, saveButton);
    });

    // Add event listener to the save button
    saveButton.addEventListener("click", function () {
        saveTask(taskItem, taskTextSpan, editButton, saveButton);
    });

    // Add a toggle functionality for marking task as completed
    taskTextSpan.addEventListener("click", function () {
        taskItem.classList.toggle("checked");
        taskTextSpan.classList.toggle("checked");
        saveData();
    });

    taskItem.appendChild(actionsDiv);
    return taskItem;
}

function editTask(taskItem, taskTextSpan, editButton, saveButton) {
    const currentText = taskTextSpan.textContent;

    // Create an input field with the current task text
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = currentText;
    inputField.className = "edit-input";

    // Replace the task text span with the input field
    taskItem.replaceChild(inputField, taskTextSpan);

    // Toggle the visibility of buttons
    editButton.style.display = "none";
    saveButton.style.display = "inline-block";
}

function saveTask(taskItem, taskTextSpan, editButton, saveButton) {
    const inputField = taskItem.querySelector(".edit-input");
    const updatedText = inputField.value;

    // Update the task text span with the new text
    taskTextSpan.textContent = updatedText;

    // Replace the input field with the updated text span
    taskItem.replaceChild(taskTextSpan, inputField);

    // Toggle the visibility of buttons
    editButton.style.display = "inline-block";
    saveButton.style.display = "none";

    // Save the updated task list
    saveData();
}

function saveData() {
    const tasks = [];
    document.querySelectorAll("#task-list .task-item").forEach(taskItem => {
        const taskText = taskItem.querySelector(".task-text").textContent;
        const checked = taskItem.querySelector(".task-text").classList.contains("checked");
        tasks.push({ text: taskText, checked: checked });
    });
    localStorage.setItem("data", JSON.stringify(tasks));
}

function showTasks() {
    listContainer.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem("data")) || [];
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.checked);
        listContainer.appendChild(taskItem);
    });
}

showTasks();
