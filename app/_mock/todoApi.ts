import todos from "./todos.json";

export type Todo = {
    id: number;
    title: string;
    description: string;
    date: string;
    completed: boolean;
};

export const getTodos = async (): Promise<Todo[]> => {
    // 실제 API처럼 비동기 흉내
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(todos);
        }, 300);
    });
};