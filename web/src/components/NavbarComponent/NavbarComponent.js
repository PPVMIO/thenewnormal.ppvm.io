import React from 'react';
import Nav from 'react-bootstrap/Nav'

class NavbarComponent extends React.Component{
  
  offWhiteStyle = {
    color: `rgb(207, 207, 207)`,
  }

  render() {
    return <Nav fill>
        <Nav.Item style={this.offWhiteStyle}>0301</Nav.Item>
        <Nav.Item style={this.offWhiteStyle}>0308</Nav.Item>
        <Nav.Item style={this.offWhiteStyle}>0315</Nav.Item>
        <Nav.Item style={this.offWhiteStyle}>0322</Nav.Item>
        <Nav.Item style={this.offWhiteStyle}>0329</Nav.Item>
        <Nav.Item style={this.offWhiteStyle}>0405</Nav.Item>
      </Nav>

  }
}

export default NavbarComponent;
