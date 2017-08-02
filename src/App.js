import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Player from './components/Player';
import LoginButton from './components/LoginButton';

class App extends Component {
  constructor(props) {
    super(props);
    // TODO better way to keep the token?
    this.state = { token: null };
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Power Hour</h2>
        </div>
        <div className="App-intro">
          <Router>
              <Switch>
                <Route exact path="/spotify-power-hour/" component={LoginButton}/>
                <Route exact path="/" component={LoginButton}/>
                <Route path="/player" component={Player}/>
                <Route path="/spotify-power-hour/player" component={Player}/>
              </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
