import * as React from "react";
import {ReactNode} from "react";
import dataService, {TodoItem} from "./DataService";
import {InputComponent} from "./InputComponent";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface HomeState {

    items: TodoItem[];

}

interface HomeProps extends RouteComponentProps {}

export class Home extends React.Component<HomeProps, HomeState> {


    constructor(props: Readonly<HomeProps>) {
        super(props);
        this.state = {
            items: []
        };
        dataService.getTodoItems().then(value => {
            this.setState({
                items: value
            });
        });
    }

    private async onNewTodoHandle(title: string) {
        let currentUser = dataService.currentUser;

        if (!dataService.isUserAuthorized() || currentUser == null) {
            return;
        }

        let todoItem = new TodoItem(-1, currentUser.login, title, new Date());

        // здесь надо сохранять новый item
        try {
        const {id} = await dataService.saveItem(todoItem);
        todoItem.id = id;
        this.setState({items:[...this.state.items, todoItem],});
        } catch (e) { alert("Error!") }
    }

    private async onItemRemove(id: number) {
        // здесь надо удалять item
        try {
            await dataService.deleteItem(id);
            this.setState({items: this.state.items.filter((item) => item.id !== id)});
        } catch (e) { alert("Error!") }
    }

    private logout() {
        try {
            dataService.currentUser = null;
            this.props.history.push('/login');
        } catch (e) { alert("Error!") }
    }

    render(): ReactNode {
        return (
            <div className="App">

                <nav className="navbar navbar-expand-lg sticky-top navbar-dark bd-navbar">
                    <a className="navbar-brand" href="#">TaskIT</a>
                    <div id="navbarNavDropdown" className="navbar-collapse collapse">
                        <ul className="navbar-nav mr-auto">

                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item text-nowrap">
                                <div className="btn btn-info" onClick={e => this.logout()}>Sign out</div>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main className="py-md-3 pl-md-5">

                    <div className="container">

                        <InputComponent onNewTodoCreated={title => this.onNewTodoHandle(title)}/>

                        <div id="items-container">
                            {this.state.items.map(todoItem => {
                                return (
                                    <div className="card" key={todoItem.id}>
                                        <div className="d-flex p-2 bd-highlight justify-content-between">
                                            <h5 className="mb-1">{todoItem.text}</h5>
                                            <div className="task-date">{todoItem.date.toLocaleString()}</div>
                                            <button className="btn btn-outline-secondary" type="button"
                                                    onClick={() => {
                                                        this.onItemRemove(todoItem.id)
                                                    }}
                                            >Delete
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                </main>

            </div>
        );
    }
}

export default withRouter(Home);