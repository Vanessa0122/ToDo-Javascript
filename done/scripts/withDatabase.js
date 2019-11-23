window.tasks = [];
window.databasePathname = 'kingston-tasks/';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.bottom-row ul').innerHTML = '';
});

document.querySelector('#taskForm').removeEventListener('submit', submitTaskForm);
document.querySelector('#taskForm').addEventListener('submit', submitTaskFormToDB);

function submitTaskFormToDB(event) {
  const taskInputField = document.querySelector('#taskTextInput');
  if (!taskTextInput.value) {
    window.alert('Please enter a task');
    return;
  }

  const key = firebase.database().ref().child(window.databasePathname).push().key;
  const newEntry = {};
  const newTask = {
    description: taskInputField.value,
    done: false,
    id: key,
  }

  newEntry[key] = newTask;
  firebase.database().ref(window.databasePathname).update(newEntry);
  taskInputField.value = '';
  event.preventDefault();
}

function markTaskAsDoneToDB(event) {
  const taskItem = event.currentTarget.parentNode;
  const id = taskItem.dataset.id;
  firebase.database().ref(`${window.databasePathname}/${id}`).update({ done: true });
}

function deleteTaskToDB(event) {
  const taskItem = event.currentTarget.parentNode;
  const id = taskItem.dataset.id;
  firebase.database().ref(`${window.databasePathname}/${id}`).remove();
}

window.addEventListener('load', () => {
  firebase.initializeApp({
    authDomain: "javascript-201-workshop.firebaseapp.com",
    databaseURL: "https://javascript-201-workshop.firebaseio.com",
  });

  firebase.database().ref(window.databasePathname).on('value', (data) => {
    const snapshot = data.val();
    if (snapshot === null) {
      firebase.database().ref(window.databasePathname).set('');
    } else {
      window.tasks = [];
      Object.keys(snapshot).forEach((entry) => {
        tasks.push({
          description: snapshot[entry].description,
          done: snapshot[entry].done,
          id: entry,
        });
      });  
      displayTasksWithHTML();
    }
  });  
});
