import React, { Component } from 'react';
import SpotifyWebApi from '../spotify-web-api-js';
import queryString from 'query-string';
import ReactInterval from 'react-interval';
import {Button, Collapse, Well, ButtonToolbar} from 'react-bootstrap';


export default (props) => {
  const parsedHash = queryString.parse(props.location.hash);
  return (
    <div className="playerBtn">
      <div>
        <Player authToken={parsedHash.access_token} />
      </div>
    </div>
  );
}

class Player extends Component {

  constructor(props) {
    super(props);
    this.onPlay = this.onPlay.bind(this);
    this.onNext = this.onNext.bind(this);
    this.fade = this._fade.bind(this);
    this.onPowerHour = this.onPowerHour.bind(this);
    this.state = {
      powerHourEnabled: false, 
      spotifyApi: new SpotifyWebApi(), 
      timeoutLength: 60000,
      fadeoutLength: 3000,
      fadeinLength: 2000,
      curVolume: null,
      goalVolume: null,
      isFading: false,
      fadeDirection: 1,
      fadeInterval: 500,
      fadeAmount: 10
    }
    this.state.spotifyApi.setAccessToken(this.props.authToken)
  }

  _fade(cur, goal, callback) {
    
    if(cur <= goal)
      return callback({})
    var that = this
    this.state.spotifyApi.setVolume(cur,{}).then(
      setTimeout(function () { that._fade(cur - 5, goal, callback) }, 200)
    )
  }

  onPlay() {
    this.state.spotifyApi.play({"context_uri": "spotify:user:1247199566:playlist:3lA4R6BviqvdRcFnp9gMlH", "offset": {"position": 5}})
  }

  onPowerHour() {
    this.setState({powerHourEnabled: !this.state.powerHourEnabled})

  }

  onNext() {
    var obj = this
    this.fade(100, 0, function () {
      obj.state.spotifyApi.skipToNext({}).then(function () {
        obj.state.spotifyApi.setVolume(100,{})
      })
    })
    console.log("timer trigger")
  }



  render() {
    const divCenter = {
      marginLeft: "auto", 
      marginRight: "auto"
    }

    return (
      <div>

        <Button bsSize="large" onClick={ ()=> this.setState({ open: !this.state.open })}>
          Instructions
        </Button>
        <Collapse in={this.state.open}>
          <div>
            <Well>
              Instructions: Spotify must be open. The power hour button will make 
              whatever you are playing a power hour. If you don't know what to play
              the play button will start the dopest of playlists.
            </Well>
          </div>
        </Collapse>

        <ReactInterval 
          timeout={this.state.timeoutLength} 
          enabled={this.state.powerHourEnabled}
          callback={this.onNext}/>
        <div style={divCenter}>
          <ButtonToolbar>
            <Button bsSize="large" bsStyle="primary" onClick={this.onNext}>
            Next
            </Button>
            <Button bsSize="large" bsStyle="primary" onClick={this.onPlay}>
            Play
            </Button>
            <Button bsSize="large" bsStyle="primary" onClick={this.onPowerHour}>
            Power Hour!!!
            </Button>
          </ButtonToolbar>
        </div>
      </div>
    );
  }
}

