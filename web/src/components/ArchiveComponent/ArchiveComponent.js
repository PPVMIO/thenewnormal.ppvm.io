import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import './ArchiveComponent.css'

class ArchiveComponent extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      images: {
        '0301': [],
        '0308': [],
        '0315': [],
        '0322': [],
        '0329': [],
        '0405': [],
        '0412': [],
        '0419': [],
        '0426': [],
        '0503': [],
        '0510': [],
        '0517': [],
      },
      week: '0412',
      imageChoice: '',
      cachedImages: [],
      showImage: false,
    }
  }

  onClick(e) {
    this.setState({
      week: e.target.text
    })


  }

  importAll(r, weekValue) {
    let images = [];
    r.keys().map((item, index) => { images.push(r(item)); });
    this.setState((state, props) => {
      state.images[weekValue] = images
    })
    return images;
  }

  updateimageChoice = () => {
    const images = this.state.images[this.state.week]
    this.setState({
      imageChoice: images[Math.floor(Math.random() * images.length)],
      showImage: !this.state.showImage
    })
  }

  componentDidMount() {
    this.importAll(require.context('../../assets/0301', false, /\.(png|jpe?g|svg)$/), '0301')
    this.importAll(require.context('../../assets/0308', false, /\.(png|jpe?g|svg)$/), '0308')
    this.importAll(require.context('../../assets/0315', false, /\.(png|jpe?g|svg)$/), '0315')
    this.importAll(require.context('../../assets/0322', false, /\.(png|jpe?g|svg)$/), '0322')
    this.importAll(require.context('../../assets/0329', false, /\.(png|jpe?g|svg)$/), '0329')
    this.importAll(require.context('../../assets/0405', false, /\.(png|jpe?g|svg)$/), '0405')
    this.importAll(require.context('../../assets/0412', false, /\.(png|jpe?g|svg)$/), '0412')
    setInterval(this.updateimageChoice, 3000);
  }

  render() {
    const cachedStyle = {
      width: 0
    }
    const cachedImages = this.state.images[this.state.week].map(image => <img src={image} style={cachedStyle}></img>)
    return <div>  
      <div class="weeks">
        <Dropdown>
          <Dropdown.Toggle size='sm' variant='secondary' id='dropdown-basic'>
            [{this.state.week}] Week Start Date
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#" onClick={(e) => this.onClick(e)}>0301</Dropdown.Item>
            <Dropdown.Item href="#" onClick={(e) => this.onClick(e)}>0308</Dropdown.Item>
            <Dropdown.Item href="#" onClick={(e) => this.onClick(e)}>0315</Dropdown.Item>
            <Dropdown.Item href="#" onClick={(e) => this.onClick(e)}>0322</Dropdown.Item>
            <Dropdown.Item href="#" onClick={(e) => this.onClick(e)}>0329</Dropdown.Item>
            <Dropdown.Item href="#" onClick={(e) => this.onClick(e)}>0405</Dropdown.Item>
            <Dropdown.Item href="#" onClick={(e) => this.onClick(e)}>0412</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <br></br>
      <br></br>
      <br></br>
      {this.state.showImage &&
        <div class="images"> 
          <Row >
            <Col>
                <img src={this.state.imageChoice}></img>
                <img src={this.state.imageChoice}></img>
            </Col>
          </Row>
          <Row >
            <Col>
                <img src={this.state.imageChoice}></img>
                <img src={this.state.imageChoice}></img>
            </Col>
          </Row>
        </div>
      }

      { cachedImages }




      </div>
  }
}

export default ArchiveComponent;