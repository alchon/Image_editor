import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_state: false,
      user_name: ''
    };
  }
  componentDidMount() {
    this.getCheck();
  }

  getCheck = () => {
    fetch('/auth/check', {
      method: 'GET'
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.success) {
        this.setState({login_state: true, user_name: data.info.user_id});
      }
      else {
        this.setState({login_state: false});
      }
    })
    .catch(() => {
      this.setState({login_state: false});
    })
  }
  logoutClickHandler = () => {
    fetch('/auth/logout', {
      method: 'POST',
    })
    .then((res) => res.json())
    .then((data) => {
      alert('로그아웃 성공!');
      this.getCheck();
    })
    .catch(() => {
      alert('error');
    })
  }
  render() {
    return (
      <div className='login'>
        {this.state.login_state ? 
        <div>
          <h5>{this.state.user_name}님 환영합니다</h5>
          <button onClick={this.logoutClickHandler}>로그아웃</button>
        </div> : 
        <div>
          <Link to={{
            pathname: '/login',
          }}><button>로그인</button></Link>
          <button>회원가입</button>
        </div>}
      </div>
    )
  }
}

export default Login;