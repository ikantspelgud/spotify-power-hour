import React, {Component} from 'react';

const CLIENT_ID = "16d85cb583694305a0e11b713a97ef21";
const REDIRECT_URI = encodeURIComponent("http://localhost:3000/player");
const AUTH_URL = `http://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-read-private%20playlist-read-collaborative%20user-library-read&state=123&redirect_uri=${REDIRECT_URI}`;

export default class LoginButton extends Component {
  authorize() {
    window.location = AUTH_URL;
  }

  render() {
    return (
      <div className="loginBtn">
        <button onClick={this.authorize} className="btn btn-primary btn-lg">
          Load Spotify Data
        </button>
      </div>
    )
  }
}