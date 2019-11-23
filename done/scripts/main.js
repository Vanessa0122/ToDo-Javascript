window.tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function displayTasks() {
  const listElement = document.querySelector('.bottom-row ul');
  listElement.innerHTML = '';
  window.tasks.forEach((item) => {
    const listItem = document.createElement('li');
    if (item.done) listItem.classList.add('done');
    listItem.classList.add('task-item');
    listItem.dataset.id = item.id;

    const listItemText = document.createElement('span');
    listItemText.textContent = item.description;

    const markAsDoneBtn = document.createElement('button');
    markAsDoneBtn.classList.add('matter-button-contained');
    markAsDoneBtn.textContent = 'Mask as done';

    const deleteBtn =  document.createElement('button');
    deleteBtn.classList.add('matter-button-contained');
    deleteBtn.classList.add('matter-secondary');
    deleteBtn.textContent = 'Delete';

    listItem.appendChild(listItemText);
    listItem.appendChild(markAsDoneBtn);
    listItem.appendChild(deleteBtn);
    listElement.appendChild(listItem);
  });

  bindTaskButtonActions();
}

function displayTasksWithHTML() {
  const listElement = document.querySelector('.bottom-row ul');
  listElement.innerHTML = '';
  window.tasks.forEach((item) => {
    listElement.innerHTML += `
      <li class="task-item ${item.done ? 'done' : ''}" data-id="${item.id}">
        <span>${item.description}</span>
        <button class="matter-button-contained">Mark as done</button>
        <button class="matter-button-contained matter-secondary">Delete</button>
      </li>
    `;
  });

  bindTaskButtonActions();
}

function submitTaskForm(event) {
  const taskInputField = document.querySelector('#taskTextInput');
  if (!taskTextInput.value) {
    window.alert('Please enter a task');
    return;
  }

  const taskObject = {
    description: taskInputField.value,
    done: false,
    id: Date.now(),
  }

  tasks.push(taskObject);
  displayTasksWithHTML();
  taskInputField.value = '';
  localStorage.setItem('tasks', JSON.stringify(tasks));
  event.preventDefault();
}

function markTaskAsDone(event) {
  const taskItem = event.currentTarget.parentNode;
  const id = Number(taskItem.dataset.id);
  tasks.find((item) => {
    if (item.id === id) {
      taskItem.classList.add('done');
      item.done = true;
      return true;
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(event) {
  const taskItem = event.currentTarget.parentNode;
  const id = Number(taskItem.dataset.id);
  tasks = tasks.filter(item => item.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  displayTasksWithHTML();
}

function bindTaskButtonActions() {
  document.querySelectorAll('.task-item').forEach((taskItem) => {
    const markAsDoneBtn = taskItem.querySelector('button:first-of-type');
    const deleteBtn = taskItem.querySelector('button:last-of-type');

    if (window.databasePathname) {
      markAsDoneBtn.addEventListener('click', markTaskAsDoneToDB);
      deleteBtn.addEventListener('click', deleteTaskToDB);
    } else {
      markAsDoneBtn.addEventListener('click', markTaskAsDone);
      deleteBtn.addEventListener('click', deleteTask);
    }
  });
}

// document.addEventListener('DOMContentLoaded', displayTasks);
document.addEventListener('DOMContentLoaded', displayTasksWithHTML);
document.querySelector('#taskForm').addEventListener('submit', submitTaskForm);
