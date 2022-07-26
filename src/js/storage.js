const ElectronStore = require("electron-store");
const store = new ElectronStore();

export const useStorage = () => {
    const getTodos = () => {
        console.log("getter called.");
        return store.get("TODO_LIST");
    };
    const setTodos = newTodoList => {
        store.set("TODO_LIST", newTodoList);
        console.log("setter called.");
    };

    return {
        getTodos,
        setTodos
    };
}