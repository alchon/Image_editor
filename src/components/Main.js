import React, { Component } from 'react';
import ImageList from './ImageList';
import Project from './Project';
import Login from './Login';
import Newproject from './New_project';
import Uploadfile from './Upload_file';
import './Main.css';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {tab:0};
  }

  changeTab = (event) => {
    this.setState({tab : parseInt(event.target.getAttribute('tab'), 10)});
  }

  render() {
    const tab = {
      0: <Newproject></Newproject>,
      1: <Uploadfile></Uploadfile>,
      2: <ImageList></ImageList>
    }
    return (
      <div className='Main'>
        <div className='sidenav'>
          <button onClick={this.changeTab} tab='0'>New Project</button>
          <button className='dropdown-btn'>Load Image</button>
          <div className='dropdown-container'>
            <button onClick={this.changeTab} tab='1'>Upload File</button>
            <button onClick={this.changeTab} tab='2'>More Image</button>
          </div>
        </div>
        <div className='right' style={{float:'right'}}>
          <button className='rightbtn'>More</button>
          <div className='right-content'>
            <button>Log In</button>
            <button>Settings</button>
          </div>
        </div>
        <div className='inner'>
          {tab[this.state.tab]}
        </div>
      </div>
    )
  }
}
export default Main;
