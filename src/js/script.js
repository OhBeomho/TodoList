import {
    useFilter
} from "./filter.js";
import {
    useStorage
} from "./storage.js";

const filters = useFilter();
const storage = useStorage();
const currentFilter = {
    get id() {
        return this.id_ || 0;
    },
    set id(newID) {
        this.id_ = newID;
        setTodoList();
    }
};

function addTodo(todoText) {
    let newTodoList = storage.getTodos();
    newTodoList.push({
        id: newTodoList.length,
        text: todoText,
        date: new Date().toLocaleDateString(),
        completed: false
    });
    storage.setTodos(newTodoList);
    setTodoList();
}

function removeTodo(todoID) {
    let newTodoList = storage.getTodos();
    newTodoList = newTodoList.filter(element => element.id !== todoID);
    storage.setTodos(newTodoList);
    setTodoList();
}

function renameTodo(todoID, newTodoText) {
    let newTodoList = storage.getTodos();
    let todo = newTodoList.find(element => element.id === todoID);
    todo.text = newTodoText;
    storage.setTodos(newTodoList);
    setTodoList();
}

function toggleComplete(todoID) {
    let newTodoList = storage.getTodos();
    let todo = newTodoList.find(element => element.id === todoID);
    todo.completed = !todo.completed;
    storage.setTodos(newTodoList);
    setTodoList();
}

function setTodoList() {
    const filteredList = filters[currentFilter.id].func();
    document.getElementById("todoList").innerHTML = "";

    for (let todo of filteredList) {
        let todoElement = document.createElement("li");
        todoElement.innerHTML = `
            <div class="list-group-item">
                <div class="input-group dropdown">
                    <span class="input-group-text todo-date">${todo.date}</span>
                    <input type="text" class="form-control todo-text" placeholder="TODO" value="${todo.text}" disabled>
                    <button class="btn btn-${todo.completed ? "primary" : "secondary"} dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false"></button>
                    <ul class="dropdown-menu user-select-none" id="dropdownTodoMenu">
                        <li><span class="dropdown-item todo-remove">삭제</span></li>
                        <li><span class="dropdown-item todo-edit">수정</span></li>
                        <li><span class="dropdown-item todo-complete">${todo.completed ? "완료 X" : "완료"}</span></li>
                    </ul>
                </div>
            </div>
        `;
        todoElement.querySelector(".todo-remove").addEventListener("click", () => removeTodo(todo.id));
        todoElement.querySelector(".todo-edit").addEventListener("click", () => todoElement.querySelector(".todo-text").disabled = false);
        todoElement.querySelector(".todo-complete").addEventListener("click", () => toggleComplete(todo.id));
        todoElement.querySelector(".todo-text").addEventListener("keydown", event => {
            if (event.key === "Enter" && todoElement.querySelector(".todo-text").value !== "") {
                renameTodo(todo.id, todoElement.querySelector(".todo-text").value);
                todoElement.querySelector(".todo-text").disabled = true;
            }
        });

        if (todo.text.toLowerCase().includes(document.getElementById("searchTodoInput").value.toLowerCase())) {
            document.getElementById("todoList").appendChild(todoElement);
        }
    }
}

window.onload = () => {
    for (let filter of filters) {
        let filterElement = document.createElement("li");
        filterElement.innerHTML = `<span class="dropdown-item">${filter.text}</span>`;
        filterElement.id = filters.indexOf(filter);
        filterElement.addEventListener("click", () => {
            currentFilter.id = filterElement.id;
            document.getElementById("dropdownButton").innerText = filters[currentFilter.id].text;
        });

        document.getElementById("dropdownFilterMenu").appendChild(filterElement);

        if (filterElement.id == 1) {
            filterElement.click();
        }
    }

    document.getElementById("addTodo").addEventListener("click", () => {
        if (document.getElementById("addTodoInput").value) {
            addTodo(document.getElementById("addTodoInput").value);
            document.getElementById("addTodoInput").value = "";
        }
    });
    document.getElementById("addTodoInput").addEventListener("keydown", event => {
        if (event.key == "Enter" && document.getElementById("addTodoInput").value) {
            addTodo(document.getElementById("addTodoInput").value);
            document.getElementById("addTodoInput").value = "";
        }
    });

    const search = () => {
        if (document.getElementById("searchTodoInput").value) {
            setTodoList();
        }
    };
    document.getElementById("searchTodo").addEventListener("click", () => search());
    document.getElementById("searchTodoInput").addEventListener("keydown", event => {
        if (event.key == "Enter" && document.getElementById("searchTodoInput").value) {
            search();
        }
    });
}