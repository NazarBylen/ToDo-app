import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [lists, setLists] = useState([]);
    const [newListTitle, setNewListTitle] = useState('');
    const [newTaskTitles, setNewTaskTitles] = useState({});
    const [editingTask, setEditingTask] = useState(null);
    const [editedTaskTitle, setEditedTaskTitle] = useState('');
    const token = localStorage.getItem('token');

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const fetchLists = async () => {
        try {
            const response = await axios.get('http://localhost:3000/lists', { headers });
            setLists(response.data);
        } catch (error) {
            console.error('Failed to fetch lists:', error);
        }
    };

    const createList = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/lists', { title: newListTitle }, { headers });
            setNewListTitle('');
            fetchLists();
        } catch (error) {
            console.error('Failed to create list:', error);
        }
    };

    const handleTaskTitleChange = (listId, value) => {
        setNewTaskTitles(prevTitles => ({
            ...prevTitles,
            [listId]: value,
        }));
    };

    const createTask = async (listId) => {
        const title = newTaskTitles[listId];
        if (!title) return;
        try {
            await axios.post(
                `http://localhost:3000/lists/${listId}/tasks`,
                { title },
                { headers }
            );
            setNewTaskTitles(prevTitles => ({ ...prevTitles, [listId]: '' }));
            fetchLists(); // Оновлюємо списки після додавання
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const toggleTaskDone = async (listId, taskId, done) => {
        try {
            await axios.put(
                `http://localhost:3000/lists/${listId}/tasks/${taskId}`,
                { done: !done },
                { headers }
            );
            fetchLists();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const startEditing = (task) => {
        setEditingTask(task.id);
        setEditedTaskTitle(task.title);
    };

    const saveEditedTask = async (listId, taskId) => {
        try {
            await axios.put(
                `http://localhost:3000/lists/${listId}/tasks/${taskId}`,
                { title: editedTaskTitle },
                { headers }
            );
            setEditingTask(null);
            fetchLists();
        } catch (error) {
            console.error('Failed to save task:', error);
        }
    };

    const deleteTask = async (listId, taskId) => {
        try {
            await axios.delete(`http://localhost:3000/lists/${listId}/tasks/${taskId}`, { headers });
            fetchLists();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchLists();
        }
    }, [token]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="mb-8 text-center text-4xl font-bold text-blue-800">Твої списки завдань</h1>
            <form onSubmit={createList} className="mb-10 flex items-center justify-center">
                <input
                    type="text"
                    placeholder="Введіть назву нового списку"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    className="w-full max-w-md rounded-l-lg border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="rounded-r-lg bg-blue-600 p-3 font-medium text-white shadow-md transition-colors hover:bg-blue-700"
                >
                    Створити
                </button>
            </form>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lists.map((list) => (
                    <div key={list.id} className="rounded-lg border border-blue-200 bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-2xl font-semibold text-blue-700">{list.title}</h2>
                        <form onSubmit={(e) => { e.preventDefault(); createTask(list.id); }}>
                            <input
                                type="text"
                                placeholder="Нове завдання"
                                className="mb-3 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none"
                                value={newTaskTitles[list.id] || ''}
                                onChange={(e) => handleTaskTitleChange(list.id, e.target.value)}
                            />
                            <button type="submit" className="w-full rounded-md bg-blue-500 p-2 text-sm text-white transition-colors hover:bg-blue-600">
                                Додати завдання
                            </button>
                        </form>
                        <ul className="mt-4 space-y-3">
                            {list.tasks.map((task) => (
                                <li key={task.id} className="flex items-center justify-between space-x-3 text-blue-600">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={task.done}
                                            onChange={() => toggleTaskDone(list.id, task.id, task.done)}
                                            className="h-5 w-5 rounded-sm text-blue-600 transition-colors"
                                        />
                                        {editingTask === task.id ? (
                                            <input
                                                type="text"
                                                value={editedTaskTitle}
                                                onChange={(e) => setEditedTaskTitle(e.target.value)}
                                                className="rounded-md border border-gray-300 p-1 text-sm focus:outline-none"
                                            />
                                        ) : (
                                            <span
                                                className={`text-lg ${task.done ? 'line-through text-gray-400' : ''}`}
                                            >
                        {task.title}
                      </span>
                                        )}
                                    </div>
                                    {editingTask === task.id ? (
                                        <button onClick={() => saveEditedTask(list.id, task.id)} className="text-blue-500 transition-colors hover:text-blue-700">
                                            Зберегти
                                        </button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <button onClick={() => startEditing(task)} className="text-gray-500 transition-colors hover:text-gray-700">
                                                Редагувати
                                            </button>
                                            <button onClick={() => deleteTask(list.id, task.id)} className="text-red-500 transition-colors hover:text-red-700">
                                                Видалити
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;