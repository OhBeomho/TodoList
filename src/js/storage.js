const ElectronStore = require("electron-store");
const store = new ElectronStore();

// Todo object structure
/*
    {
        id: <number>,
        text: <string>,
        startDate: <string>,
        endDate: <string>,
        completed: <boolean>
    }
*/
export const useStorage = () => {
    const getTodos = () => store.get("TODO_LIST");
    const setTodos = newTodoList => store.set("TODO_LIST", newTodoList);

    return {
        getTodos,
        setTodos
    };
}