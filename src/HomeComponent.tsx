import * as React from "react";
import {ReactNode} from "react";
import dataService, {CakeItem} from "./DataService";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface HomeState {

    items: CakeItem[];

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

    private async onItemRemove(id: number) {
        try {
            await dataService.deleteItem(id);
            this.setState({items: this.state.items.filter((item) => item.id !== id)});
        } catch (e) { alert("Error!") }
    }

    private logout() {
        try {
            dataService.currentUser = null;
            this.props.history.push('/logout');
        } catch (e) { alert("Error!") }
    }

    private create_cake() {
        try {
            this.props.history.push('/createcake');
        } catch (e) { alert("Error!") }
    }

    render(): ReactNode {
        return (
            <div className="App">

                <nav className="navbar navbar-expand-lg sticky-top navbar-dark bd-navbar">
                    <a className="navbar-brand" href="#">Список заказов</a>
                    <div id="navbarNavDropdown" className="navbar-collapse collapse">
                        <ul className="navbar-nav mr-auto">

                        </ul>
                        <ul className="navbar-nav mr-2">
                            <li className="nav-item text-nowrap">
                                <div className="btn btn-info" onClick={e => this.create_cake()}>Создать торт</div>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item text-nowrap">
                                <div className="btn btn-info" onClick={e => this.logout()}>Выйти</div>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main className="py-md-3 pl-md-5">

                    <div className="container">

                        <div id="items-container">
                            {this.state.items.map(todoItem => {
                                return (
                                    <div className="card mb-3" key={todoItem.id}>
                                        <div className="card-header">
                                            Заказ{todoItem.id}
                                            <button className="btn btn-outline-secondary float-right" type="button"
                                                    onClick={() => {
                                                        this.onItemRemove(todoItem.id)
                                                    }}
                                            >Delete
                                            </button>
                                            <div className="float-right mr-2">{todoItem.date}</div>
                                        </div>
                                        <div className="card-body">
                                            <p className="card-text">
                                                <table className="table table-striped">
                                                    <tbody>
                                                    <tr className="d-flex">
                                                        <td className="col-2">Вес торта(в кг)</td>
                                                        <td className="col-9">{todoItem.cake_size}</td>
                                                    </tr>
                                                    <tr className="d-flex">
                                                        <td className="col-2">Ярусы</td>
                                                        <td className="col-9">{todoItem.cake_tier}</td>
                                                    </tr>
                                                    <tr className="d-flex">
                                                        <td className="col-2">Коржи</td>
                                                        <td className="col-9">{todoItem.cake_filling}</td>
                                                    </tr>
                                                    <tr className="d-flex">
                                                        <td className="col-2">Крем</td>
                                                        <td className="col-9">{todoItem.cake_cream}</td>
                                                    </tr>
                                                    <tr className="d-flex">
                                                        <td className="col-2">Декор</td>
                                                        <td className="col-9">{todoItem.cake_decor}</td>
                                                    </tr>
                                                    </tbody>
                                               </table>
                                            </p>
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