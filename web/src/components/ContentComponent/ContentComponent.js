import React from 'react';
import Container from 'react-bootstrap/Container'

import ChartComponent from '../ChartComponent/ChartComponent'
import './ContentComponent.css'
import ArchiveComponent from '../ArchiveComponent/ArchiveComponent'
import ReactLoading from 'react-loading';
import backupdata from './test-data.json'

class ContentComponent extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      isDataLoaded: false
    }
  }
  
  componentDidMount() {
    console.log('Fetching Covid Data')
    console.log("DEV MODE OFF")
    console.log(process.env.REACT_APP_LOAD_DATA)
    if (!process.env.REACT_APP_LOAD_DATA) {
      fetch('https://gfurjt6aze.execute-api.us-east-1.amazonaws.com/prod/data')
        .then(res => res.json())
        .then(
          (res) => {
            console.log(res)
            this.setState({
              data: res,
              isDataLoaded: true
            })
          },
          (error) => {
            this.setState({
              data: backupdata,
              isDataLoaded: true
            })
          }
        )
    }
  }

  loadingStyle = {
    margin: 'auto',
    verticalAlign: 'middle',
  }
  
  render() {
    if (this.state.isDataLoaded) {
      return <Container fluid='true'>
          <div class='chart'>
            <ChartComponent data={this.state.data}></ChartComponent>
          </div>
          <div class='archive'>
            <ArchiveComponent></ArchiveComponent>
          </div>
      </Container>
    } else {
      if (!process.env.REACT_APP_LOAD_DATA) {
        return <Container fluid='true'>
            <div class='loading'>
              <br></br>
              <center>
                <ReactLoading type={'spin'} color={'white'} width={'30%'}></ReactLoading>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h1>LOADING CASES</h1>
              </center>
            </div>
            <div class='archive'>
              <ArchiveComponent></ArchiveComponent>
            </div>
        </Container>
      } else {
        return <Container fluid='true'>
          <div class='archive'>
            <ArchiveComponent></ArchiveComponent>
          </div>
      </Container>
      }
    }
  }
}

export default ContentComponent;
