import React, {Component} from 'react';

const APP_NAME = "spotify-power-hour";
const CLIENT_ID = "16d85cb583694305a0e11b713a97ef21";
const REDIRECT_URI = encodeURIComponent(getRedirectURI());
const AUTH_URL = `http://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-read-private%20playlist-read-collaborative%20user-library-read%20user-read-playback-state%20user-modify-playback-state&state=123&redirect_uri=${REDIRECT_URI}`;

function getRedirectURI() {
  let loc = window.location, appNameLoc = loc.href.indexOf(APP_NAME), baseURI;

  if (appNameLoc === -1) {
    // This might be coming from localhost, create URI based on base host name
    baseURI = loc.protocol + "//" + loc.hostname;
    if (loc.port && loc.port !== 80 && loc.port !== 443) {
      baseURI += ":" + loc.port;
    }
  } else {
    // Include the app name and then add the player page information after
    baseURI = loc.href.substring(0, appNameLoc + APP_NAME.length);
  }
  return baseURI + "/player";
}

export default class LoginButton extends Component {
  authorize() {
    window.location = AUTH_URL;
  }

  render() {
    return (
      <div onClick={this.authorize} className="button">
        Load Spotify Data
      </div>
    )
  }
}
