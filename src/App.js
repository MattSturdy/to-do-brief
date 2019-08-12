import React, { Component } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKiwiBird } from "@fortawesome/free-solid-svg-icons";
import firebase, { provider } from "./firebase";

class App extends Component {
  state = { editValue: "", toDoArray: [] };

  signIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        this.setState({
          user
        });
        this.checkForUserCollection(user.uid);
        // ...
      })
      .catch(function(error) {
        console.log(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  };

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

  handleDelete = key => {
    this.setState(state => {
      const toDoArray = state.toDoArray.filter((item, j) => key !== j);
      return {
        toDoArray
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
            return (
              <li key={key}>
                {todo}
                <FontAwesomeIcon
                  icon={faKiwiBird}
                  onClick={() => this.handleDelete(key)}
                />
              </li>
            );
          })}
          <button onClick={this.signIn}>Sign In</button>
        </header>
      </div>
    );
  }
}

export default App;
