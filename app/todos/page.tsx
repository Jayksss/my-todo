"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { getTodos, Todo } from "../_mock/todoApi";

export default function TodosPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState<string>("");
    const [newTodoDescription, setNewTodoDescription] = useState<string>("");
    const [newTodoDate, setNewTodoDate] = useState<string>("2026-04-06");

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const loadTodos = async () => {
            try {
                setIsLoading(true);
                setErrorMessage("");

                const response = await getTodos();
                setTodos(response);
            } catch (error) {
                console.error("할 일 목록 조회 실패", error);
                setErrorMessage("할 일 목록을 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        void loadTodos();
    }, []);

    const handleChangeNewTodoTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setNewTodoTitle(event.target.value);
    };

    const handleChangeNewTodoDescription = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setNewTodoDescription(event.target.value);
    };

    const handleChangeNewTodoDate = (event: ChangeEvent<HTMLInputElement>) => {
        setNewTodoDate(event.target.value);
    };

    const handleSubmitTodo = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedTitle = newTodoTitle.trim();
        const trimmedDescription = newTodoDescription.trim();

        if (!trimmedTitle) {
            alert("할 일 제목을 입력하세요.");
            return;
        }

        const newTodo: Todo = {
            id: Date.now(),
            title: trimmedTitle,
            description: trimmedDescription || "설명이 없습니다.",
            date: newTodoDate || "2026-04-06",
            completed: false,
        };

        setTodos((prevTodos) => [newTodo, ...prevTodos]);
        setNewTodoTitle("");
        setNewTodoDescription("");
        setNewTodoDate("2026-04-06");
    };

    const handleToggleTodo = (todoId: number) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === todoId
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        );
    };

    const handleDeleteTodo = (todoId: number) => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    };

    const summary = useMemo(() => {
        const totalCount = todos.length;
        const completedCount = todos.filter((todo) => todo.completed).length;
        const incompleteCount = totalCount - completedCount;

        return {
            totalCount,
            completedCount,
            incompleteCount,
        };
    }, [todos]);

    if (isLoading) {
        return (
            <section className="todo-page">
                <div className="todo-page__header">
                    <div>
                        <h2>할 일 목록</h2>
                        <p>Mock API 데이터를 불러오는 중입니다...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (errorMessage) {
        return (
            <section className="todo-page">
                <div className="todo-page__header">
                    <div>
                        <h2>할 일 목록</h2>
                        <p className="todo-page__error">{errorMessage}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="todo-page">
            <div className="todo-page__header">
                <div>
                    <span className="todo-page__eyebrow">My Todo</span>
                    <h2>할 일 목록 테스트 화면</h2>
                    <p>현재는 JSON Mock 데이터 기반으로 동작합니다.</p>
                </div>
            </div>

            <div className="todo-summary">
                <div className="todo-summary__card">
                    <span className="todo-summary__label">전체</span>
                    <strong className="todo-summary__value">{summary.totalCount}</strong>
                </div>

                <div className="todo-summary__card">
                    <span className="todo-summary__label">완료</span>
                    <strong className="todo-summary__value">
                        {summary.completedCount}
                    </strong>
                </div>

                <div className="todo-summary__card">
                    <span className="todo-summary__label">미완료</span>
                    <strong className="todo-summary__value">
                        {summary.incompleteCount}
                    </strong>
                </div>
            </div>

            <form className="todo-form-card" onSubmit={handleSubmitTodo}>
                <div className="todo-form-card__header">
                    <h3>할 일 추가</h3>
                    <p>제목, 설명, 날짜를 입력하고 새 할 일을 등록하세요.</p>
                </div>

                <div className="todo-form-grid">
                    <div className="todo-field">
                        <label htmlFor="title">할 일 제목</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="예: Spring API 명세 정리"
                            value={newTodoTitle}
                            onChange={handleChangeNewTodoTitle}
                        />
                    </div>

                    <div className="todo-field">
                        <label htmlFor="date">일정일</label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={newTodoDate}
                            onChange={handleChangeNewTodoDate}
                        />
                    </div>

                    <div className="todo-field todo-field--full">
                        <label htmlFor="description">설명</label>
                        <input
                            id="description"
                            type="text"
                            name="description"
                            placeholder="예: API 요청/응답 예시와 DTO 구조 정리"
                            value={newTodoDescription}
                            onChange={handleChangeNewTodoDescription}
                        />
                    </div>
                </div>

                <div className="todo-form-card__actions">
                    <button type="submit">할 일 추가</button>
                </div>
            </form>

            {todos.length === 0 ? (
                <div className="todo-empty">
                    <p>등록된 할 일이 없습니다.</p>
                </div>
            ) : (
                <ul className="todo-list">
                    {todos.map((todo) => (
                        <li key={todo.id} className="todo-item-card">
                            <div className="todo-item-card__header">
                                <label className="todo-item-card__checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleToggleTodo(todo.id)}
                                    />
                                    <span
                                        className={
                                            todo.completed
                                                ? "todo-item-card__title todo-item-card__title--completed"
                                                : "todo-item-card__title"
                                        }
                                    >
                    {todo.title}
                  </span>
                                </label>

                                <button
                                    type="button"
                                    className="todo-item-card__delete-button"
                                    onClick={() => handleDeleteTodo(todo.id)}
                                >
                                    삭제
                                </button>
                            </div>

                            <p className="todo-item-card__description">{todo.description}</p>

                            <div className="todo-item-card__meta">
                <span className="todo-item-card__meta-badge">
                  일정일 {todo.date}
                </span>
                                <span
                                    className={
                                        todo.completed
                                            ? "todo-item-card__status todo-item-card__status--completed"
                                            : "todo-item-card__status"
                                    }
                                >
                  {todo.completed ? "완료" : "진행 중"}
                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}