import React, { Component } from 'react';
import SpotifyWebApi from '../spotify-web-api-js';
import queryString from 'query-string';
import ReactInterval from 'react-interval';
import {Button, Collapse, Well, ButtonGroup} from 'react-bootstrap';


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
    this.fade = this.fade.bind(this);
    this.onPowerHour = this.onPowerHour.bind(this);
    this.state = {
      powerHourEnabled: false, 
      spotifyApi: new SpotifyWebApi(), 
      timeoutLength: 60000,
    }
    this.state.spotifyApi.setAccessToken(this.props.authToken)
  }

  getVolume(){
    return 100
  }

  fade(props, callback) {
    var d = new Date()
    props.start_vol = this.getVolume()
    if (props.vol_delta === undefined){
      props.vol_delta = (props.goal_volume?props.goal_volume:0) - props.start_vol
    }
    if (props.start_time === undefined){
      props.start_time = d.getTime()
    }
    if(props.fade_time === undefined){
      props.fade_time = 3000
    }

    var cur_time = d.getTime();
    var time_passed = cur_time - props.start_time
    
    if(time_passed >= props.fade_time){
       this.state.spotifyApi.setVolume(props.vol_delta + props.start_vol, function  (){
         typeof callback === 'function' && callback()
       })   
      return
    }

    var cur = Math.floor(props.vol_delta * (time_passed / props.fade_time))
    if (props.vol_delta < 0) cur+=100
    var that = this
    setTimeout(function (){
      that.state.spotifyApi.setVolume(cur,{},function (){ 
        that.fade(props, callback) 
      })
    },200)
  }

  isActiveDev(callback){
    this.state.spotifyApi.getMyDevices(function(err,retObj) {
      if (retObj){
        var isActive = retObj["devices"].reduce(function(isTrue,val){ 
          return isTrue || val.is_active
        },false)
        callback(isActive)
      }
    })
  }


  onPlay() {

    this.state.spotifyApi.play({
      "context_uri": "spotify:user:1247199566:playlist:3lA4R6BviqvdRcFnp9gMlH",
      "offset": {"position": 5}
    })
  }

  onPowerHour() {
    this.isActiveDev(function(active) {
      if(!active){
        window.open('https://open.spotify.com')

        //Open the spotify web player
        console.log(active)
      }
    })
    this.setState({powerHourEnabled: !this.state.powerHourEnabled})
  }

  onNext() {
    var obj = this
    this.fade({vol_delta: -100}, function () {
      obj.state.spotifyApi.skipToNext({}, function () {
        obj.fade({vol_delta:100, fade_time:2000})
      })
    })
  }



  render() {
    return (
      <div>
        <Button bsSize="large" onClick={ ()=> this.setState({ open: !this.state.open })}>
          Instructions
        </Button>
        <Collapse in={this.state.open}>
          <div>
            <Well>
              Spotify must be open. The power hour button will make 
              whatever you are playing a power hour. If you don't know what to
              play the play button will start the dopest of playlists. 
              NOTE: This will turn your spotifies volume up to max, so lower 
              the volume
              on your machine if neccisary.
            </Well>
          </div>
        </Collapse>

        <ReactInterval 
          timeout={this.state.timeoutLength} 
          enabled={this.state.powerHourEnabled}
          callback={this.onNext}/>
 


       <div>
          <ButtonGroup>
            <Button bsSize="large" bsStyle="primary" onClick={this.onNext}>
            Next
            </Button>
            <Button bsSize="large" bsStyle="primary" onClick={this.onPlay}>
            Play
            </Button>
            <Button bsSize="large" bsStyle={this.state.powerHourEnabled?"primary":"default"} onClick={this.onPowerHour}>
            {this.state.powerHourEnabled?"Power Hour On":"Power Hour Off"}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

