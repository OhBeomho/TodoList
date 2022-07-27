import {
    useStorage
} from "./storage.js";

const today = new Date().toLocaleDateString("ko-KR");

export const useFilter = () => {
    const getAllTodos = () => useStorage().getTodos();
    const getFailedTodos = () => useStorage().getTodos().filter(todo => new Date(todo.endDate) < new Date(today) && !todo.completed);
    const getActiveTodos = () => useStorage().getTodos().filter(todo => new Date(todo.endDate) >= new Date(today) && !todo.completed);
    const getIncompletedTodos = () => useStorage().getTodos().filter(todo => !todo.completed);
    const getCompletedTodos = () => useStorage().getTodos().filter(todo => todo.completed);

    const filters = [
        {
            text: "모든 작업",
            func: getAllTodos
        },
        {
            text: "진행중인 작업",
            func: getActiveTodos
        },
        {
            text: "완료한 작업",
            func: getCompletedTodos
        },
        {
            text: "완료하지 못한 작업",
            func: getIncompletedTodos
        },
        {
            text: "기간 내에 못한 작업",
            func: getFailedTodos
        }
    ];

    return filters;
}