import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TitleComponent from './components/TitleComponent/TitleComponent';
import NavbarComponent from './components/NavbarComponent/NavbarComponent';
import ContentComponent from './components/ContentComponent/ContentComponent';

class App extends React.Component {

  constructor(props) {
    super(props) 
    const allGifs = [
      'https://media.giphy.com/media/XaFlLH9fYzv6ZCgl7q/giphy.gif', 
      'https://media1.giphy.com/media/Qx4jDmzq6xtdgJr6VA/giphy.gif',
      'https://media.giphy.com/media/Qx4jDmzq6xtdgJr6VA/giphy.gif',
      'https://media.giphy.com/media/m9vzSLDi0MDDTMdhS8/giphy.gif',
      'https://media.giphy.com/media/lngxij8z4rcel44fKt/giphy.gif',
      'https://media.giphy.com/media/lngxij8z4rcel44fKt/giphy.gif',
      'https://media.giphy.com/media/IbrreJdJmWz1cueonS/giphy.gif'
    ]
    this.state = {
      gifs: allGifs,
      containerStyle: {
        backgroundImage: 'url(' + allGifs[allGifs.length - 1] + ')',
        height: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
      }
    }
  }

  updateBackgroundImage = () => {
    console.log(this.state)
    const gifs = this.state.gifs
    const newImage = gifs[Math.floor(Math.random() * gifs.length)]
    console.log('Changing Image')
    console.log(newImage)

    this.setState({
      containerStyle: {
        backgroundImage: 'url(' + newImage + ')',
        height: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
      }
    })
  }

  componentDidMount() {
    setInterval(this.updateBackgroundImage, 20000);
  }

  render() {
    return <div class='Background' style={this.state.containerStyle}>
        <div className='App'>
          <br></br>
          <TitleComponent></TitleComponent>
          <ContentComponent></ContentComponent>
        </div>
      </div>
  }
}

export default App;
