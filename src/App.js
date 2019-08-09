import React, { Component } from "react";
import "./App.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCoffee } from "@fortawesome/free-solid-svg-icons";

class App extends Component {
  state = { editValue: "", toDoArray: [] };

  handleChange = event => {
    this.setState({ editValue: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.addToDo();
  };

  addToDo = () => {
    this.setState(state => {
      const toDoArray = [...state.toDoArray, state.editValue];
      return {
        toDoArray,
        editValue: ""
      };
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Hey Guys Make a To Do list</h2>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              value={this.state.editValue}
              onChange={this.handleChange}
            />
          </form>
          {this.state.toDoArray.map((todo, key) => {
            return <li key={key}>{todo}</li>;
          })}
        </header>
      </div>
    );
  }
}

export default App;
