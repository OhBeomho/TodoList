import {
    useStorage
} from "./storage.js";

const today = new Date().toLocaleDateString();

export const useFilter = () => {
    const getAllTodos = () => useStorage().getTodos();
    const getTodayTodos = () => useStorage().getTodos().filter(todo => todo.date === today && !todo.completed);
    const getIncompletedTodos = () => useStorage().getTodos().filter(todo => !todo.completed);
    const getCompletedTodos = () => useStorage().getTodos().filter(todo => todo.completed);

    const filters = [
        {
            text: "모든 작업",
            func: getAllTodos
        },
        {
            text: "오늘 해야될 작업",
            func: getTodayTodos
        },
        {
            text: "해야될 모든 작업",
            func: getIncompletedTodos
        },
        {
            text: "완료한 작업",
            func: getCompletedTodos
        },
    ];

    return filters;
}