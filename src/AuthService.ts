interface User {
    login: string;
    password: string;
}

class AuthService {

    private isAuthorized: boolean = false;

    public isUserAuthorized() {
        return this.isAuthorized;
    }

    public async login(userLogin: string, password: string) {
        let userResponsePromise: Promise<Response> = fetch("http://localhost:4000/user");

        let response: Response = await userResponsePromise;

        let jsonPromise: Promise<User[]> = (response).json();

        let users: User[] = await jsonPromise;

        let foundUsers = users.filter(value => {
            return value.login === userLogin;
        });

        if (foundUsers.length === 0) {
            this.isAuthorized = false;
            return;
        }

        let foundUser = foundUsers[0];

        if (foundUser.password === password) {
            this.isAuthorized = true;
            return;
        }
        this.isAuthorized = false;
    }

}

let authService = new AuthService();
export default authService;