import React from 'react';
import {RouteComponentProps, withRouter} from "react-router-dom";
import dataService, {CakeItem} from "./DataService";


// мы используем react-router и хотим иметь доступ к параметрам пути
// поэтому наследуемся от RouteComponentProps
interface CreateCakeProps extends RouteComponentProps {
}

interface CreateCakeState {
    weight : number
    tier : number
    filling: string;
    cream: string;
    decor: string[];
}

class CreateCake extends React.Component<CreateCakeProps, CreateCakeState> {


    constructor(props: Readonly<CreateCakeProps>) {
        super(props);
        this.state = {
            weight : 1,
            tier : 1,
            filling : "Ванильный",
            cream : "Ванильный",
            decor : ["","","","",""]
        };
    }


    async create_cake() {
        // сохраняем всё это, чтобы после авторизации перейти на нужную страницу
        let history = this.props.history;
        let location = this.props.location;
        let {from} = location.state || {from: {pathname: "/"}};
    }

    private logout() {
        try {
            dataService.currentUser = null;
            this.props.history.push('/login');
        } catch (e) { alert("Error!") }
    }

    private main_menu() {
        try {
            this.props.history.push('/home');
        } catch (e) { alert("Error!") }
    }

    private async new_order() {
        let currentUser = dataService.currentUser;

        if (!dataService.isUserAuthorized() || currentUser == null) {
            return;
        }

        let final_decor : string[] = [];
        for (let i=0; i < this.state.decor.length; i++)
        {
            if (this.state.decor[i] != "")
                final_decor.push(this.state.decor[i])
        }
        let s : string = final_decor.join(", ")
        let todoItem = new CakeItem(-1, currentUser.login, this.state.weight, this.state.tier,
            this.state.filling, this.state.cream, s, new Date());

        // здесь надо сохранять новый item
        try {
            const {id} = await dataService.saveItem(todoItem);
            todoItem.id = id;
        } catch (e) { alert("Error!") }
        try {
            this.props.history.push('/home');
        } catch (e) { alert("Error!") }
    }

    handleChangesWeight(newValue: string) {
        if (parseInt(newValue) > 15) {
            alert("Невозможно сделать торт больше 15 кг. Вес торта останется 15 кг")
            this.setState({
                weight : 15
            });
        }
        this.setState({
            weight : parseInt(newValue)
        });
    }

    handleChangesTier(newValue: string) {
        if (parseInt(newValue)*3 > this.state.weight) {
            if (this.state.weight/3 < 0) {
                this.setState({
                    tier : 1
                });
            }
            else {
                this.setState({
                    tier : Math.floor(this.state.weight/3)
                });
            }
            alert("Невозможно сделать столько ярусов на торте текущего веса. Количество ярусов останется "+this.state.tier)
        }
        else if (parseInt(newValue) > 5) {
            alert("Невозможно сделать торт выше 5-ти ярусов. Количество ярусов останется 5")
            this.setState({
                tier : 5
            });
        }
        else
            this.setState({
                tier : parseInt(newValue)
            });
    }

    handleChangesFilling(newValue: string) {
        this.setState({
            filling : newValue
        });
    }

    handleChangesCream(newValue: string) {
        this.setState({
            cream : newValue
        });
    }

    handleChangesDecor(val : number, name: string) {
        if (this.state.decor[val] == "")
            this.state.decor[val] = name;
        else
            this.state.decor[val] = "";
    }

    render(): React.ReactNode {
        return (
           <div className="App">

                <nav className="navbar navbar-expand-lg sticky-top navbar-dark bd-navbar">
                    <a className="navbar-brand" href="#">Создать торт</a>
                    <div id="navbarNavDropdown" className="navbar-collapse collapse">
                        <ul className="navbar-nav mr-auto">

                        </ul>
                        <ul className="navbar-nav mr-2">
                            <li className="nav-item text-nowrap">
                                <div className="btn btn-info" onClick={e => this.main_menu()}>На Главную</div>
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
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="weight">Вес торта (в кг)</span>
                            </div>
                            <input className="form-control" aria-describedby="inputGroup-sizing-default"
                                   type="number" min="1" max="15"
                                   placeholder="1"
                                   id="mouse-only-number-input"
                                   onChange={event => this.handleChangesWeight(event.target.value)}/>
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="tier">Количество ярусов</span>
                            </div>
                            <input className="form-control" aria-describedby="inputGroup-sizing-default"
                                   type="number" min="1" max="5"
                                   placeholder="1"
                                   id="mouse-only-number-input"
                                   onChange={event => this.handleChangesTier(event.target.value)}/>
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="inputGroupSelect01">Коржи</label>
                            </div>
                            <select className="custom-select" id="inputGroupSelect01" onChange={event => this.handleChangesFilling(event.target.value)}>
                                <option selected>Выберите вкус</option>
                                <option value="Ванильный">Ванильный</option>
                                <option value="Шоколадный">Шоколадный</option>
                                <option value="Морковный">Морковный</option>
                                <option value="Крем-брюле">Крем-брюле</option>
                                <option value="Ирландский">Ирландский Виски</option>
                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="inputGroupSelect02">Крем</label>
                            </div>
                            <select className="custom-select" id="inputGroupSelect02" onChange={event => this.handleChangesCream(event.target.value)}>
                                <option selected>Выберите вкус</option>
                                <option value="Ванильный">Ванильный</option>
                                <option value="Шоколадный">Шоколадный</option>
                                <option value="Сливочно-сырный">Сливочно-сырный</option>
                                <option value="Клубничный">Клубничный</option>
                                <option value="Лаймовый">Лаймовый</option>
                            </select>
                        </div>
                        <div className="card mb-2">
                            <div className="card-header mb-2">
                                Декор
                            </div>
                            <div className="custom-control custom-checkbox mb-0.5 ml-2">
                            <input type="checkbox" className="custom-control-input" id="customCheck1"
                                   onChange={() => this.handleChangesDecor(0, "Ягоды")}/>
                                <label className="custom-control-label" htmlFor="customCheck1">Ягоды
                                </label>
                            </div>
                            <div className="custom-control custom-checkbox mb-0.5 ml-2">
                            <input type="checkbox" className="custom-control-input" id="customCheck2"
                                   onChange={() => this.handleChangesDecor(1, "Акварельный рисунок")}/>
                                <label className="custom-control-label" htmlFor="customCheck2">Акварельный рисунок
                                </label>
                            </div>
                            <div className="custom-control custom-checkbox mb-0.5 ml-2">
                            <input type="checkbox" className="custom-control-input" id="customCheck3"
                                   onChange={() => this.handleChangesDecor(2, "Игрушка из мастики")}/>
                                <label className="custom-control-label" htmlFor="customCheck3">Игрушка из мастики
                                </label>
                            </div>
                            <div className="custom-control custom-checkbox mb-0.5 ml-2">
                            <input type="checkbox" className="custom-control-input" id="customCheck4"
                                   onChange={() => this.handleChangesDecor(3, "Леденцы")}/>
                                <label className="custom-control-label" htmlFor="customCheck4">Леденцы
                                </label>
                            </div>
                            <div className="custom-control custom-checkbox mb-2 ml-2">
                            <input type="checkbox" className="custom-control-input" id="customCheck5"
                                   onChange={() => this.handleChangesDecor(4, "Живые цветы")}/>
                                <label className="custom-control-label" htmlFor="customCheck5">Живые цветы
                                </label>
                            </div>
                        </div>
                        <button className="btn btn-outline-secondary float-right" type="button"
                                                    onClick={() => {this.new_order()}}
                                            >Сделать заказ
                        </button>
                    </div>
                </main>
           </div>
        )
    }

}

export default withRouter(CreateCake);