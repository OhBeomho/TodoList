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

function addTodo(todoText, startDate, endDate) {
    let newTodoList = storage.getTodos();
    newTodoList.push({
        id: newTodoList.length,
        text: todoText,
        startDate,
        endDate,
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

function setTodoList(search = "") {
    const filteredList = filters[currentFilter.id].func();
    document.getElementById("todoList").innerHTML = "";

    for (let todo of filteredList) {
        let todoElement = document.createElement("li");
        todoElement.innerHTML = `
            <div class="list-group-item">
                <div class="input-group dropdown">
                    <span class="input-group-text todo-date">${todo.startDate}<br>~<br>${todo.endDate}</span>
                    <input type="text" class="form-control todo-text" placeholder="TODO" value="${todo.text}" disabled>
                    <button class="btn btn-${todo.completed ? "primary" : (filters[3].func().find(e => e.id === todo.id) ? "danger" : "secondary")} dropdown-toggle" type="button" data-bs-toggle="dropdown"
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

        if (search === "" || todo.text.toLowerCase().includes(search.toLowerCase())) {
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
            currentFilter.id = Number(filterElement.id);
            document.getElementById("dropdownButton").innerText = filters[currentFilter.id].text;

            if (filterElement.id === "3") {
                document.getElementById("dropdownButton").classList.remove("btn-outline-primary", "btn-outline-secondary");
                document.getElementById("dropdownButton").classList.add("btn-outline-danger");
            } else if (filterElement.id === "1") {
                document.getElementById("dropdownButton").classList.remove("btn-outline-primary", "btn-outline-danger");
                document.getElementById("dropdownButton").classList.add("btn-outline-secondary");
            } else {
                document.getElementById("dropdownButton").classList.remove("btn-outline-danger", "btn-outline-secondary");
                document.getElementById("dropdownButton").classList.add("btn-outline-primary");
            }
        });

        document.getElementById("dropdownFilterMenu").appendChild(filterElement);

        if (filterElement.id === "1") {
            filterElement.click();
        }
    }

    document.getElementById("addTodo").addEventListener("click", () => onAddTodo());
    document.getElementById("addTodoInput").addEventListener("keydown", event => {
        if (event.key === "Enter") {
            onAddTodo();
        }
    });
    const onAddTodo = () => {
        if (document.getElementById("addTodoInput").value
            && document.getElementById("addTodoSDInput").value
            && document.getElementById("addTodoEDInput").value) {
            let startDateInput = new Date(document.getElementById("addTodoSDInput").value);
            let endDateInput = new Date(document.getElementById("addTodoEDInput").value);

            if (startDateInput > endDateInput) {
                document.getElementById("error").innerText = "시작 날짜가 종료 날짜보다 클 수 없습니다.";
                return;
            }

            addTodo(document.getElementById("addTodoInput").value,
                startDateInput.toLocaleDateString("ko-KR"),
                endDateInput.toLocaleDateString("ko-KR"));

            document.getElementById("addTodoInput").value = "";
            document.getElementById("addTodoSDInput").value = "";
            document.getElementById("addTodoEDInput").value = "";
            document.getElementById("error").innerText = "";
            document.getElementById("addForm").classList.remove("show");
        }
    }

    document.getElementById("searchTodo").addEventListener("click", () => setTodoList(document.getElementById("searchTodoInput").value));
    document.getElementById("searchTodoInput").addEventListener("keydown", event => {
        if (event.key === "Enter") {
            setTodoList(document.getElementById("searchTodoInput").value);
        }
    });
}