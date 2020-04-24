import React from 'react';
import './TitleComponent.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class TitleComponent extends React.Component{
  titleStyle = {
    font: "Helvetica Neue",
    color: "white",
  }

  aTagStyle = {
    color: "white",
  }
  
  render() {
    return <div class="Title">
      <h1 style={this.titleStyle}>THE NEW NORMAL</h1>
      <h6 style={this.titleStyle}>by <a href='https://ppvm.io' style={this.aTagStyle}>PPVMIO</a> :: NEW YORK, NY</h6>
    </div>
  }
}

export default TitleComponent;