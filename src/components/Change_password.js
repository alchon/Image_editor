import React, { Component } from 'react';

class Change_password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_password: '',
      new_password: '',
      confirm_password: '',
    }
    this.id = props.match.params.id;
  }

  validatePassword = () => {
    if(this.state.new_password === '' || this.state.confirm_password === '') {
      return false;
    }
    return this.state.new_password === this.state.confirm_password;
  }

  change_passwordHandler = (e) => {
    const { name, value } = e.target;
    this.setState({ [name] : value});
  }

  change_passwordClickHandler = (e) => {
    e.preventDefault();
    const {current_password, new_password} = this.state;
    const id = this.id;
    if(!this.validatePassword()) {
      alert('두 비밀번호가 서로 다름');
      return;
    }
    if(this.id) {
      fetch('/auth/changeUserPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id, current_password, new_password})
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.msg === 'success') {
          alert('변경 성공');
          window.location.replace('/');
        }
        else {
          alert('변경 실패');
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      })
    }
  }

  render() {
    return(
      <div className="Change_password">
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <form className="login100-form validate-form">
                <span className="login100-form-title">
                  비밀번호 변경
              </span>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" name="current_password" placeholder="Current password" value={this.state.current_password} onChange={this.change_passwordHandler}/>
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" name="new_password" placeholder="New password" value={this.state.new_password} onChange={this.change_passwordHandler} />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" name="confirm_password" placeholder="Confirm password" value={this.state.confirm_password} onChange={this.change_passwordHandler} />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" id="confirm" onClick={this.change_passwordClickHandler}>
                    확인
                </button>
                </div>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" id="cancel" onClick={() => this.props.history.push('/')}>
                    취소
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Change_password;