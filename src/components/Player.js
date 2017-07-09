import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js'
import Iframe from 'react-iframe'

export default (props) => {
  return (
    <div>
      <div>
        <Player/>
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

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    

    //get this by doing a request on the spotify web api console and looking what it uses for bearer
    var authToken = 'BQBISUwuma2fPruSk563s3Cu7k2i7isRkCSt4kWuC31k31PK8qFGIJomJ6J1on_KZTo-lWNMa4C0QdOw2Spb1cLudWuJc30XKl_O2FdEzz0-WwWbR_P8BU85PBHKxTvc68x-4dhlgTfhkbib_J-F_DeMzg4kbt5Gd_r1vYxppf1FmgXXt_3Zyi7R8Z_C0bTKJfmeXUyDJy9PeA8Tgtz1aV_Pq-cOgEi7vB1IgdSpZvIhO7nLaBbFbD0HGF0d3kSm4dDSVKNCWutvf4tkidJVUul0EKRPQtLwfEsrc37chZ9q1732Snhu2mYm8xsiJEeMz-ATdw'

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

