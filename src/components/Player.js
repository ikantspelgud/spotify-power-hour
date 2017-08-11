import React, { Component } from 'react';
import SpotifyWebApi from '../spotify-web-api-js';
import queryString from 'query-string';
import ReactInterval from 'react-interval';
import {Collapse, Well} from 'react-bootstrap';


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
      curVolume: 100,
      powerHourEnabled: false, 
      spotifyApi: new SpotifyWebApi(), 
      timeoutLength: 60000,
    }
    this.state.spotifyApi.setAccessToken(this.props.authToken)
  }

  fade(props, callback) {
    var d = new Date()
    if(props.vars_set === undefined){
      props.vars_set = true
      props.start_vol = this.state.curVolume
      props.start_time = d.getTime()
      if (!props.vol_delta) {
        props.vol_delta = ((props.goal_volume?props.goal_volume:0) - props.start_vol)
      }
      props.fade_time = props.fade_time || 3000
    }

    var cur_time = d.getTime();
    var time_passed = cur_time - props.start_time
    var cur = Math.min(100, Math.floor(props.vol_delta * (time_passed / props.fade_time)))
    
    if(time_passed >= props.fade_time){
      var vol = props.goal_volume || (Math.round(cur/100)*100)
      this.state.spotifyApi.setVolume(Math.max(0, Math.min(100,vol)), function  (){
         typeof callback === 'function' && callback()
       })   
      return
    }

    if (props.vol_delta < 0){ cur+=100 }
    var that = this
    setTimeout(function (){
      that.state.spotifyApi.setVolume(Math.max(0,Math.min(100,cur)), function (){ 
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
    }, this.setState({isPlaying: !this.state.isPlaying}))
  }

  openSpotify(){
    window.open('https://open.spotify.com')
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


        <ReactInterval 
          timeout={this.state.timeoutLength} 
          enabled={this.state.powerHourEnabled}
          callback={this.onNext}/>
 
        <div className={this.state.powerHourEnabled?"button":"neon-off"} onClick={this.onPowerHour}>
          Power Hour On
        </div>

        <div>
          <div className="button" onClick={this.openSpotify}>
            Prev
          </div>
          
          <div className="button" onClick={this.onPlay}>
            {this.state.isPlaying?"Pause":"Play"}
          </div>
          <div className="button" onClick={this.onNext}>
            Next
          </div>
          
        </div>
        <div className="button" onClick={ ()=> this.setState({ open: !this.state.open })}>
          Instructions
        </div>
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
      </div>
    );
  }
}

