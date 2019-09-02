import React, { Component } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {

  faTrashAlt,
  faClipboardCheck,
  faClipboard,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import firebase, { provider, firestore } from "./firebase";
import SwipeableList from "./Components/SwipeableList";
import ListContainer from "./Containers/ListContainer";

class App extends Component {
  state = {
    editValue: "",
    toDoArray: [],
    user: "",
    completeArray: [],
    userName: ""
  };

  signIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        this.setState({
          user: user.uid,
          userName: user.email
        });
        this.checkForUserCollection(user.uid);
        // ...
      })
      .catch(function (error) {
        console.log(error);
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // // The email of the user's account used.
        // var email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
      });
  };

  signOut = () => {
    console.log("testing signout");
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.setState({
          toDoArray: [],
          completeArray: [],
          userName: "",
          user: ""
        });
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened.
      });
  };

  checkForUserCollection = userToken => {
    firestore
      .collection("user")
      .doc(userToken)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.data()) {
          console.log("user data doesn't exist yet");
          console.log("making user collection in database");
          this.createUserCollection(userToken);
        } else {
          console.log("user data exists already");
          firestore
            .collection("user")
            .doc(userToken)
            .get()
            .then(querySnapshot => {
              const addedArray = querySnapshot.data().toDo;
              const toDoArray = [...this.state.toDoArray, ...addedArray];
              const addedCompleteArray = querySnapshot.data().complete;
              const completeArray = [
                ...this.state.completeArray,
                addedCompleteArray
              ];
              this.setState({ toDoArray, completeArray });
            });
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        return null;
      });
  };

  createUserCollection(userToken) {
    if (this.state.toDoArray)
      firestore
        .collection("user")
        .doc(userToken)
        .set({
          toDo: this.state.toDoArray,
          complete: this.state.completeArray
        });
  }

  handleChange = event => {
    // event.preventDefault();
    // const trimmedValue = event.target.value.trim();
    this.setState({ editValue: event.target.value });
    // return trimmedValue.lenth ? : null
  };

  handleSubmit = event => {
    event.preventDefault();
    this.addToDo();
  };

  addToDo = () => {
    this.setState(state => {
      const trimmedValue = state.editValue.trim();
      let toDoArray = state.toDoArray;

      if (trimmedValue) {
        toDoArray = [...state.toDoArray, trimmedValue];
      }
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

  handleDeleteComplete = key => {
    this.setState(state => {
      const completeArray = state.completeArray.filter((item, j) => key !== j);
      return {
        completeArray
      };
    });
  };

  handleComplete = key => {
    this.setState(state => {
      const completeArray = [...state.completeArray, state.toDoArray[key]];
      const toDoArray = state.toDoArray.filter((item, j) => key !== j);
      return {
        toDoArray,
        completeArray
      };
    });
  };

  handleUnComplete = key => {
    this.setState(state => {
      const toDoArray = [...state.toDoArray, state.completeArray[key]];
      const completeArray = state.completeArray.filter((item, j) => key !== j);
      return {
        toDoArray,
        completeArray
      };
    });
  };

  saveToDo = user => {
    this.createUserCollection(user);
    alert("your To-Do list is saved");
  };

  handleEdit = key => {
    this.setState(state => {
      const toDoArray = state.toDoArray.filter((item, j) => key !== j);
      const editValue = state.toDoArray[key];
      return { editValue, toDoArray };
    });
  };

  loggedIn = () => {
    return this.state.userName ? (
      <nav>{`Logged in as ${this.state.userName}`}</nav>
    ) : null;
  };
  /*/////////////////////////////////////////////swipeable code below////////////////////////////////////////////////////*/

  /*/////////////////////////////////////////////swipeable code above////////////////////////////////////////////////////*/
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.loggedIn()}
          <h2>Hey Guys Make a To Do list</h2>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              value={this.state.editValue}
              onChange={this.handleChange}
            />
          </form>
          <ul>
            {this.state.toDoArray.map((todo, key) => {
              return (
                <li key={todo}>
                  {todo}
                  <div>
                    <FontAwesomeIcon
                      className="icon"
                      icon={faTrashAlt}
                      onClick={() => this.handleDelete(key)}
                    />
                    <FontAwesomeIcon
                      className="icon"
                      icon={faClipboardCheck}
                      onClick={() => this.handleComplete(key)}
                    />
                    <FontAwesomeIcon
                      className="icon"
                      icon={faEdit}
                      onClick={() => this.handleEdit(key)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <button onClick={this.signIn}>Sign In</button>
          <button onClick={this.signOut}>Sign Out</button>
          <button onClick={() => this.saveToDo(this.state.user)}>
            Save your To do
          </button>
          <h2>Completed Tasks</h2>
          <ul>
            {this.state.completeArray.map((todo, index) => {
              return (
                <li className="complete" key={index}>
                  {todo}
                  <div>
                    <FontAwesomeIcon
                      className="icon"
                      icon={faTrashAlt}
                      onClick={() => this.handleDeleteComplete(index)}
                    />
                    <FontAwesomeIcon
                      className="icon"
                      icon={faClipboard}
                      onClick={() => this.handleUnComplete(index)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          {/* <ListContainer>
            <SwipeableList>eggs</SwipeableList>
            <SwipeableList>milk</SwipeableList>
            <SwipeableList>bread</SwipeableList>
          </ListContainer> */}
        </header>
      </div>
    );
  }
}

export default App;
