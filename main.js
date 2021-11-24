const text = document.getElementById("text");
const addTaskButton = document.getElementById("add-task-btn");
const listBox = document.getElementById("listBox");
const checked = 'checked';
// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'http://localhost:8080/lists/89851872-3689-41b0-b350-a449cf4e3419',
    auth: {
        username: 'oracle',
        password: 'Welcome1'
    }
});

let todoArray = [];

addTaskButton.addEventListener("click", (e) => {
    e.preventDefault();
    instance.post('/tasks', {
        "description": text.value
    })
        .then(function (response) {
            text.value = "";
            displayTodo('');
        })
        .catch(function (error) {
            console.log(error);
        });
});

function displayTodo(filter) {
    let url = `/tasks?filter=${filter === "" ? '' : filter}`;
    instance.get(url)
        .then(function (todo) {
            // handle success
            if (todo !== null) {
                todoArray = todo.data;

                let htmlCode = "";
                todoArray.forEach((list, ind) => {
                    htmlCode += `<div class='flex mb-4 items-center'>
      <p class='w-full text-grey-darkest'>${list.description}</p>
      <input type="checkbox" class="form-checkbox h-8 w-8" ${list.completed == true ? checked : ""} onchange='markTodoStatus("${list.id}",this.checked)' />
      <button onclick='deleteTodo("${list.id}")' class='flex-no-shrink p-2 ml-2 border-2 rounded text-white bg-red-500'>Delete</button>
   </div>`;
                });
                listBox.innerHTML = htmlCode;
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

function deleteTodo(id) {
    let url = `/tasks/${id}`;
    instance.delete(url)
        .then(function (response) {
            displayTodo('');
        })
        .catch(function (error) {
            console.log(error);
        });
}

function markTodoStatus(id, status) {
    let url = `/tasks/${id}`;
    instance.patch(url, {
        "completed": status
    })
        .catch(function (error) {
            console.log(error);
        })
}

displayTodo('');