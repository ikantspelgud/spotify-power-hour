import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from './shades.png';
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
          <h1>Power Hour</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className="App-intro">
          <Router>
              <Switch>
                <Route path="/player" component={Player}/>
                <Route path="/spotify-power-hour/player" component={Player}/>
                <Route exact path="/spotify-power-hour" component={LoginButton}/>
                <Route exact path="/" component={LoginButton}/>
              </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
