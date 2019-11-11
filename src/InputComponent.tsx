import React, {ReactNode} from "react";

interface InputComponentState {

    currentValue: string;

}

interface InputComponentProps {

    onNewTodoCreated: (title: string) => void;

}

export class InputComponent extends React.Component<InputComponentProps, InputComponentState> {

    constructor(props: Readonly<InputComponentProps>) {
        super(props);
        this.state = {
            currentValue: ""
        };
    }

    handleChanges(newStringValue: string) {
        this.setState({
            currentValue: newStringValue
        });
    }

    handleSave() {
        this.props.onNewTodoCreated(this.state.currentValue);
    }

    render(): ReactNode {
        return (
            <div className="input-group mb-3">
                <input type="text" onChange={event => this.handleChanges(event.target.value)}
                       value={this.state.currentValue} className="form-control" placeholder="Дело..."/>
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" onClick={event => this.handleSave()}
                            type="button">Добавить
                    </button>
                </div>
            </div>
        );
    }

}