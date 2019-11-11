import * as React from "react";
import {ReactNode} from "react";
import dataService, {TodoItem} from "./DataService";
import {InputComponent} from "./InputComponent";

interface HomeState {

    items: TodoItem[];

}

export class Home extends React.Component<{}, HomeState> {


    constructor(props: Readonly<{}>) {
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

        let savedItem = await dataService.saveItem(todoItem);
        this.setState({
            items: [...this.state.items, savedItem]
        });
    }

    private async onItemRemove(id: number) {
        let succeeded = await dataService.deleteItem(id);
        if (succeeded) {
            const undeletedItems: TodoItem [] = this.state.items.filter((item) => item.id !== id);
            this.setState({
                items: undeletedItems
            });
        }
    }

    render(): ReactNode {
        return (
            <div className="App">

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

export default Home;