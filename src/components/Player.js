import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Iframe from 'react-iframe';
import queryString from 'query-string';

export default (props) => {
  const parsedHash = queryString.parse(props.location.hash);
  return (
    <div>
      <div>
        <Player authToken={parsedHash.access_token} />
      </div>
      <div>
        <PlayerWindow/>
      </div>
    </div>
  );
}



class PlayerWindow extends Component {

  render(){
    return (
      <Iframe url="https://open.spotify.com/embed?uri=spotify:track:3zSCNTXI7Ed0PiidZVmzIe" width="90%" height="90%" frameborder="0" allowtransparency="true"></Iframe>
      )
  }
}

class Player extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    

    //get this by doing a request on the spotify web api console and looking what it uses for bearer
    var authToken = this.props.authToken || 'BQCz-IHnREjJiTIxuIkvMaDHFTM_GZrzbLORiXGEiwYKHGYm72OhDhaQOxRGg232Lqgq9M4A-c0leiEzkqfCIqkBHjuAPgrqdkANlbCyrRHq5mQpcWbP9UzWZrTO5v0htLK3ZYHeN8STc6pSHxm1KDXXyQzCKTvszw3tRX_FdsI';

    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(authToken);
    var info = spotifyApi.getMyDevices()  // note that we don't pass a user id
      .then(function(data) {
        //console.log('device' , data.devices[0].id);
        console.log('User playlists', data);
        spotifyApi.play({"context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr", "offset": {"position": 5}})

      }, function(err) {
        console.error(err);
      });

    console.log(info)
  }



  render() {
    return (
      <div>
        <button type="button" onClick={this.handleClick}>
        Play
        </button>
      </div>
    );
  }
}

