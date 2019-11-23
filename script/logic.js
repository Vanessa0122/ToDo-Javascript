//Global name space : window 
//This is an array with 3 empty objects 
// window.task = [
//     {
//         description: 'This is the first task',
//         //We are going to use this to control the UI 
//         done: false,
//         id:1
//     },
//     {
//         description: 'This is the second task',
//         //We are going to use this to control the UI 
//         done: false,
//         id:2
//     },
//     {
//         description: 'This is the third ask',
//         //We are going to use this to control the UI 
//         done: true,
//         id:3
//     }
// ];

//LocalStorage is a reserved keyword in javascript 
//parse this out as a javascript object (JSON)
//If that is undefined, it will give you an empty array 
//You have to do JSON.parse because the localStorage is a string of json objects
window.task = JSON.parse(localStorage.getItem('task')) || [];
console.log(window.task);

//This function is responsible to show the task on HTML 
function displayTaskWithHTML() {
    //pointint to the HTML element. UL is the tag name, unordered list 
    const listElement = document.querySelector('.bottom-row ul');
    //We want to wipe out the card, and then put fresh content on the top
    //innerHTML is a DOM property to insert content to a specified id of an element. It is used in Javascript to manipulate DOM.
    listElement.innerHTML = '';
    //Looping through the element with forEach without returning anything !
    window.task.forEach((item) => {
        //Writing HTML within javascript 
        //As javascript loop through the array, it is going to go through each element 
        //and then get the description
        //<span> tag in HTML holds the text 
        //${item.done ? 'done': ''} depending on the task, put done in the template, let CSS handle the rest 
        listElement.innerHTML += `
            <li data-id="${item.id}" class="task-item ${item.done ? 'done': ''}">
                <span>${item.description}</span>
                <button class = "matter-button-contained">Mark as Done</button>
                <button class = "matter-button-contained matter-secondary">Delete</button>
            </li>
        `; 
    });

    bindTaskButtonActions();
}


function bindTaskButtonActions(){
    //Find all the task items and return it as an array 
    //Loop through the array with the following function
    //Task element = each element in the array  
    //Look for the mark as done and delete button 
    //There are two buttons in the result of querySelectorAll
    //we are only getting he mark as done -> get it using [0]
    document.querySelectorAll('.task-item').forEach((taskElement)=>{
        //Declare the buttons so that we can listen to the event later 
        const markAsDoneButton = taskElement.querySelectorAll('button')[0];
        const deleteButton = taskElement.querySelectorAll('button')[1];
        //wiring up the button, when it is clicked, call the follwing function 
        //BUT WHEN WHERE'S NO EVENT IT STILL WORKED? 
        markAsDoneButton.addEventListener('click', (event)=>{
            //Know which item you are pointing to 
            const taskElement = event.currentTarget.parentNode;
            const id = Number(taskElement.dataset.id);
            window.task.find((item)=>{
                if (item.id === id){
                    //Apply the done style to the element from CSS
                    taskElement.classList.add('done');
                    item.done = true;
                    return true;
                }
            });
            const taskJsonString = JSON.stringify(window.task);
            localStorage.setItem('task', taskJsonString);
        });

        deleteButton.addEventListener('click', (event)=>{
            //Look into the event find the parent element, which is the task element 
            const taskElement = event.currentTarget.parentNode;
            //Turn the string into a number 
            const id = Number(taskElement.dataset.id);
            //Resssign your self with a new set of value 
            window.task = window.task.filter(item => item.id != id);
            //Refresh the UI 
            displayTaskWithHTML();
            const taskJsonString = JSON.stringify(window.task);
            localStorage.setItem('task', taskJsonString);
        });
    
    });
}

function submitTaskForm(event){
    //Preventing auto refresh
    event.preventDefault()
    const taskInputField = document.querySelector('#taskTextInput');
    const inputValue = taskInputField.value;
    if(!inputValue){
        window.alert("Please enter a description");
        return; 
    }

    //Create a new javascript object
    const taskObject = {
        description: inputValue,
        done: false,
        id: Date.now()
    };
    window.task.push(taskObject);

    //Making the input field blank 
    //taskInputField is the whole HTML 
    //In order to empty out the text, you have to call field.value()
    taskInputField.value = '';

    //Turns the whole task array in to a string of JSON objects
    const taskJsonString = JSON.stringify(window.task);
    localStorage.setItem('task', taskJsonString);
    displayTaskWithHTML();
}


displayTaskWithHTML();
document.querySelector('#taskForm').addEventListener('submit', submitTaskForm);