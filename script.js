//TODOS ARRAY
let todos;
if(!sessionStorage.getItem('todoList')){
    todos = [];
}else{
    todos = JSON.parse(sessionStorage.getItem('todoList'));
}
    //ADD TODO
const addTodo = (e) => {
    e.preventDefault();
    //COLLECTING DATA
    const todoName = document.getElementById("todo").value;
    const todoDate = document.getElementById("date").value;
    let dateInSec;
    //If todoDate is not null, convert in seconds
    if (todoDate) {
        let dateEntered = new Date(todoDate);
        dateInSec = Math.abs(dateEntered) / 1000;
    }else{
        dateInSec = null;
    }
    //CLEARING INPUTS
    document.getElementById("todo").value = '';
    document.getElementById("date").value = '';
    //VALIDATION
    let error = handleValidation(todoName);
    //DIDN'T PASSED
    if(error){
        document.getElementById('error').innerHTML = error;
    //PASSED
    }else{
        document.getElementById('error').innerHTML = '';
        const obj = {
            todoName,
            todoDate: dateInSec,
            completed: false
        }
        //ADDING NEW TODO
        todos.unshift(obj);
        sessionStorage.setItem('todoList', JSON.stringify(todos));
        showTodos();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-btn').addEventListener('click', addTodo);
    showTodos();
})

// VALIDATION 

const handleValidation = (todoName) => {
    let error = null;
    // todoName
    if (todoName === '' || todoName === null) {
        error = 'Todo input is required';
    }
    if (todoName.length > 160) {
        error = 'Todo allowing max 160 input characters'
    }
    return error;
}
// SHOW TODOS
const showTodos = (id) => {
    let todolist = document.querySelector('.todo-list');
    todolist.innerHTML = '';
    //SORTING BY DATE
    const sortedTodos = todos.sort((a, b) => {
            if(a.todoDate === null && a.completed === false && b.completed === false) return 1;
            else if(b.todoDate === null && a.completed === false && b.completed === false) return -1;
            else if(a.completed === false && b.completed === false) return a.todoDate - b.todoDate;
    });
    //IF showTodos CALLED WITH ID
    //COUNT HOW MANY COMPLETED TODOS
    if (id!==undefined) {
        let count = 0;
        sortedTodos.forEach(todo => {
            if (todo.completed) {
                count++;
            }
        });
        //MOVE BEFORE LAST COMPLETED
        arrayMove(sortedTodos, id, sortedTodos.length-count);
    }
    sortedTodos.forEach((todo, id) => {
        todolist.appendChild(addRow(id, todo.todoName, todo.todoDate, todo.completed));
    });
}
// ADD ROW
const addRow = (id, todoName, todoDate, completed) => {
    //CREATING ELEMENTS
    let todoDiv = document.createElement("DIV");
    let description = document.createElement("P");
    let timeLeft = document.createElement("P");
    let interactDiv = document.createElement("DIV");
    let deleteBtn = document.createElement("BUTTON");
    let completeCheck = document.createElement("INPUT");
    completeCheck.setAttribute("type", "checkbox");
    completed ? completeCheck.checked = true : completeCheck.checked = false;
    completed ? description.style.textDecoration = 'line-through' : 
    description.style.textDecoration = 'none';
    completed ? timeLeft.style.textDecoration = 'line-through' : 
    timeLeft.style.textDecoration = 'none';
    //ADDING CLASSES
    todoDiv.className = 'todo';
    description.className = 'description';
    timeLeft.className = 'timeLeft';
    interactDiv.className = 'interactDiv';
    deleteBtn.className = 'deleteBtn';
    completeCheck.className = 'completeCheck';
    //ASSIGN VALUES
    description.innerHTML = todoName;
        timeLeft.innerHTML = (todoDate === null || Number.isNaN(todoDate)) ? 'No deadline' : timeTillDeadline(todoDate, new Date()) + ' left'
    deleteBtn.innerHTML = 'delete';
    //EVENT LISTENERS
    deleteBtn.addEventListener('click', () => {
        if (confirm('Do yo really want to delete ' + todoName+ ' ?')) {
            handleDelete(id);
        } else {
            console.log('Deletion canceled');
        }
    });
    completeCheck.addEventListener('click', () => {
        handleComplete(id);
    })
    //APPEND
    interactDiv.appendChild(completeCheck);
    interactDiv.appendChild(deleteBtn);
    todoDiv.appendChild(description);
    todoDiv.appendChild(timeLeft);
    todoDiv.appendChild(interactDiv);
    return todoDiv;
}

// CALCULATING TIME LEFT TILL DEADLINE

function timeTillDeadline(dateFuture, dateNow) {
    dateNow = Math.abs(dateNow)/1000; 
    if (dateFuture > dateNow) {
            //COUNTING DIFFERENCE BETWEEN DATES IN SECONDS
        let diffMilisec = dateFuture - dateNow;
        // DAYS, 1DAY = 86400s
        let days = Math.floor(diffMilisec / 86400);
        // TIME LEFT
        diffMilisec = diffMilisec - days * 86400;

        // HOURS
        let hours = Math.floor(diffMilisec / 3600);
        if (hours === 24) {
            hours = 0;
        }
        diffMilisec = diffMilisec -  hours * 3600;

        // MINUTES
        let minutes = Math.floor(diffMilisec / 60);
        if (minutes === 60) {
            minutes = 0;
        }
        diffMilisec = diffMilisec - minutes * 60;
        // FORMATTING
        if (minutes<10) {
            minutes = '0'+minutes;
        }
        if (hours<10) {
            hours = '0'+hours;
        }
        if (days<10) {
            days = '0'+days;
        }
        return days + ':' + hours + ':' + minutes;
    }else{
        return '00' + ':' + '00' + ':' + '00';
    }
  }

    //HANDLE DELETE

const handleDelete = (id) => {
    let todoList = document.querySelector('.todo-list');
    todos.splice(id, 1);
    sessionStorage.setItem("todoList", JSON.stringify(todos));
    todoList.childNodes[id].remove();
    showTodos();
}

    //HANDLE COMPLETE

const handleComplete = (id) => {
    let checkBox = document.querySelectorAll('.completeCheck');
    let todoList = document.querySelector('.todo-list');

        //WHEN UNCHECK
    if (checkBox[id].checked) {
        todos[id].completed = true;
        todoList.childNodes[id].childNodes[0].style.textDecoration = 'line-through';
        todoList.childNodes[id].childNodes[1].style.textDecoration = 'line-through';
        showTodos(id);
        //WHEN UNCHECK
    }else{
        todos[id].completed = false;
        //GETTIING COMPLETED AND UNCOMPLETED TODOS
        const completedTodos = todos.filter(a=>a.completed === true);
        const unCompletedTodos = todos.filter(a=>a.completed === false);
        //SORTING UNCOMPLETED TODOS
        const sortedUncompletedTodos = unCompletedTodos.sort((a, b)=>{
            if(a.todoDate === null) return 1;
                else if(b.todoDate === null) return -1;
                else return a.todoDate - b.todoDate;
        })
        //CONCAT ARRAYS
        todos = sortedUncompletedTodos.concat(completedTodos);
        todoList.childNodes[id].childNodes[0].style.textDecoration = 'none';
        todoList.childNodes[id].childNodes[1].style.textDecoration = 'none';
        showTodos();
    }
    sessionStorage.setItem("todoList", JSON.stringify(todos));
}
// MOVE ELEMENT
function arrayMove(todos, fromIndex, toIndex) {
    var element = todos[fromIndex];
    todos.splice(fromIndex, 1);
    todos.splice(toIndex, 0, element);
}