export interface User {
    login: string;
    password: string;
}

export class TodoItem {

    id: number;

    author: string;

    text: string;

    date: Date;

    constructor(id: number, author: string, text: string, date: Date) {
        this.id = id;
        this.author = author;
        this.text = text;
        this.date = date;
    }

}

// Класс для работы с сервером
class DataService {

    private static DB_URL = "http://localhost:4000";

    public currentUser: User | null;

    constructor() {
        this.currentUser = null;
    }

    /**
     * Авторизован ли пользователь?
     */
    public isUserAuthorized() {
        return this.currentUser != null;
    }

    /**
     * Авторизация
     * @param userLogin логин
     * @param password пароль
     */
    public async login(userLogin: string, password: string) {
        let userResponsePromise: Promise<Response> = fetch("http://localhost:4000/user");

        let response: Response = await userResponsePromise;

        let jsonPromise: Promise<User[]> = (response).json();

        let users: User[] = await jsonPromise;

        let foundUsers = users.filter(value => {
            return value.login === userLogin;
        });

        if (foundUsers.length === 0) {
            this.currentUser = null;
            return;
        }

        let foundUser = foundUsers[0];

        if (foundUser.password === password) {
            this.currentUser = foundUser;
            return;
        }
        this.currentUser = null;
    }

    /**
     * Получить все TodoItem пользователя
     */
    public async getTodoItems(): Promise<TodoItem[]> {
        if (this.currentUser == null) {
            return Promise.reject("User is not authorized");
        }

        let todoResponsePromise: Promise<Response> = fetch(`${DataService.DB_URL}/todo?author=${this.currentUser.login}`);

        let response: Response = await todoResponsePromise;

        let jsonPromise: Promise<TodoItem[]> = (response).json();

        return await jsonPromise;
    }

    /**
     * Добавить новый TodoItem на сервер
     * @param newItem новый TodoItem
     */
    public async saveItem(newItem: TodoItem): Promise<TodoItem> {
        if (this.currentUser == null) {
            return Promise.reject("User is not authorized");
        }

        delete newItem.id;
        let postPromise = fetch(`${DataService.DB_URL}/todo`, {
            method: "POST",
            body: JSON.stringify(newItem)
        });
        return await (await postPromise).json();
    }

    /**
     * Удалить TodoItem
     * @param id идентификатор item'a
     * @returns true, если получилось удалить
     */
    public async deleteItem(id: number): Promise<boolean> {
        if (this.currentUser == null) {
            return Promise.reject("User is not authorized");
        }

        let deletePromise = fetch(`${DataService.DB_URL}/todo/${id}`, {
            method: "DELETE"
        });

        return (await deletePromise).ok;
    }

}

let dataService = new DataService();
export default dataService;