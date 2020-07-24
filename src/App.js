import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Auth } from 'aws-amplify';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ChangePassword from './components/auth/ChangePassword';
import ChangePasswordConfirm from './components/auth/ChangePasswordConfirm';
import ForgotPassword from './components/auth/ForgotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import Welcome from './components/auth/Welcome';
import Footer from './components/Footer';
import Home from './components/Home';
import Navbar from './components/NavbarComponent/Navbar';
import BookingSearch from './components/pages/BookingSearchComponent/BookingSearch';
import Contact from './components/pages/ContactComponent/Contact';
import ContactManagerment from './components/pages/ContactManagerment/ContactManagerment';
import CreateBooking from './components/pages/CreateBookingComponent/CreateBooking';
import ReservationDetail from './components/pages/ReservationDetail';
import ReservationReport from './components/pages/ReservationReport';
import SummaryReportOne from './components/pages/SummaryReportOneComponent/SummaryReportOne';
import ViewBooking from './components/pages/ViewBookingComponent/ViewBooking';
import ProductAdmin from './components/ProductAdmin';
import Products from './components/Products';

library.add(faEdit);

class App extends Component {

  state = {
    isAuthenticated: false,
    isAuthenticating: true,
    user: null,
    user_session: null,
    groups: null
  }

  setAuthStatus = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  setUser = user => {
    this.setState({ user: user });
  }

  setUserSession = user_session => {
    this.setState({ user_session: user_session })
  }

  async componentDidMount() {
    try {
      const session = await Auth.currentSession();
      this.setAuthStatus(true);
      this.setUserSession(session);
      const user = await Auth.currentAuthenticatedUser();
      this.setUser(user);
    } catch (error) {
      if (error !== 'No current user') {
        console.log(error);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  render() {
    const authProps = {
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser
    }
    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Router>
          <div>
            <Navbar auth={authProps} />
            <Switch>
              <Route exact path="/" render={(props) => <Home {...props} auth={authProps} />} />
              <Route exact path="/products" render={(props) => <Products {...props} auth={authProps} />} />
              <Route exact path="/admin" render={(props) => <ProductAdmin {...props} auth={authProps} />} />
              <Route exact path="/login" render={(props) => <LogIn {...props} auth={authProps} />} />
              <Route exact path="/register" render={(props) => <Register {...props} auth={authProps} />} />
              <Route exact path="/forgotpassword" render={(props) => <ForgotPassword {...props} auth={authProps} />} />
              <Route exact path="/forgotpasswordverification" render={(props) => <ForgotPasswordVerification {...props} auth={authProps} />} />
              <Route exact path="/changepassword" render={(props) => <ChangePassword {...props} auth={authProps} />} />
              <Route exact path="/changepasswordconfirmation" render={(props) => <ChangePasswordConfirm {...props} auth={authProps} />} />
              <Route exact path="/welcome" render={(props) => <Welcome {...props} auth={authProps} />} />
              <Route exact path="/contact" render={(props) => <Contact {...props} />} />
              <Route exact path="/createbooking" render={(props) => <CreateBooking {...props} />} />
              <Route exact path="/contactmanagerment" render={(props) => <ContactManagerment {...props} />} />
              <Route exact path="/viewbooking" render={(props) => <ViewBooking {...props} />} />
              <Route exact path="/booking_search" render={(props) => <BookingSearch {...props} />} />
              <Route exact path="/summary_report_01" render={(props) => <SummaryReportOne {...props} />} />

              <Route exact path="/reservationreport" render={(props) => <ReservationReport {...props} />} />
              <Route path="/reservationdetail" render={(props) => <ReservationDetail {...props} />} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
