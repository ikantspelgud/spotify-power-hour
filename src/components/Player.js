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
    this._doFade = this._doFade.bind(this);
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

  fadeVolume(props) {
    this.setState({
      curVolume: props.curVolume, //probably wanna get this from spotify eventually
      goalVolume: props.goalVolume,
      fadeAmount: Math.round(Math.abs(props.curVolume - props.goalVolume) / ((props.time/1000) / .25)), 
      fadeInterval: 5,//props.time / Math.abs(props.curVolume - props.goalVolume),
      fadeDirection: props.curVolume > props.goalVolume ? -1 : 1,
      isFading: true
    })
  }

  _doFade() {
    this.setState({curVolume: this.state.fadeDirection * this.state.fadeAmount + this.state.curVolume})
    
    if(this.state.fadeDirection === 1){
      if(this.state.curVolume >= this.state.goalVolume){
        this.setState({isFading: false})
      }
    }
    else if (this.state.curVolume <= this.state.goalVolume){
        this.setState({isFading: false})
    }
    else{
      this.state.spotifyApi.setVolume(this.state.curVolume, {})
    }
  }

  onPlay() {
    this.state.spotifyApi.play({"context_uri": "spotify:user:1247199566:playlist:3lA4R6BviqvdRcFnp9gMlH", "offset": {"position": 5}})
  }

  onPowerHour() {
    this.setState({powerHourEnabled: !this.state.powerHourEnabled})

  }

  onNext() {
    this.fadeVolume({curVolume:100, goalVolume:0, time:3000})
    this.state.spotifyApi.skipToNext({})
    this.fadeVolume({curVolume:0, goalVolume:100, time:3000})
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
          time={this.state.fadeInterval} 
          enabled={this.state.isFading} 
          callback={this._doFade}/>
        
        <ReactInterval 
          timeout={this.state.timeoutLength} 
          enabled={this.state.powerHourEnabled}
          callback={this.onNext}/>
        <div style={divCenter}>
          <ButtonToolbar>  
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

