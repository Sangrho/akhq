import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';
import { organizeRoles } from '../../utils/converters';
import { get, logout } from '../../utils/api';
import { uriCurrentUser, uriLogout } from '../../utils/endpoints';

class Header extends Component {
  state = {
    login: sessionStorage.getItem('login')
  };

  async logout() {
    try {
      await logout(uriLogout());
      await get(uriCurrentUser()).then(res => {
        let currentUserData = res.data;
        sessionStorage.setItem('login', currentUserData.logged);
        sessionStorage.setItem('user', 'default');
        sessionStorage.setItem('roles', organizeRoles(currentUserData.roles));
        this.setState({ login: currentUserData.logged }, () => {
          this.props.history.replace({
            ...this.props.history,
            pathname: '/ui/login',
            howSuccessToast: true,
            successToastMessage: 'Logged out successfully'
          });
          window.location.reload(false);
        });
      });
    } catch (err) {
      if (err.status === 404) {
        this.props.history.replace('/ui/page-not-found', { errorData: err });
      } else {
        this.props.history.replace('/ui/error', { errorData: err });
      }
    }
  }

  render() {
    const { title, children } = this.props;
    const { login } = this.state;

    return (
      <React.Fragment>
        <div
          className="title"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          {' '}
          <h1>{title}</h1>{' '}
          {login === 'false' || !login ? (
            <Link to="/ui/login">
              <button
                data-turbolinks="false"
                className="btn btn-primary"
                style={{ float: 'right' }}
              >
                {' '}
                <i className="fa fa-fw fa-sign-in" aria-hidden="true" />
                Login
              </button>
            </Link>
          ) : (
            <Link to="#">
              <button
                data-turbolinks="false"
                className="btn btn-primary"
                style={{ float: 'right' }}
                onClick={() => {
                  this.logout();
                }}
              >
                {' '}
                <i className="fa fa-fw fa-sign-in" aria-hidden="true" />
                Logout
              </button>
            </Link>
          )}
          {children}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Header);
