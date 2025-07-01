import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { message } from 'antd';
import { Button, Form } from 'react-bootstrap';
import photo1 from '../../images/photo1.png';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", user);
      if (res.data.success) {
        const { token, userData } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        message.success('Login successful');

        switch (userData.type) {
          case "admin":
            navigate("/adminHome");
            break;
          case "user":
            navigate("/userhome");
            break;
          default:
            navigate("/login");
            break;
        }
      } else {
        message.error(res.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>
            <Link to="/">BOOK MY DOCTOR</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll></Nav>
            <Nav>
              <Link to="/">Home</Link>
              <Link to="/login" className="mx-2">Login</Link>
              <Link to="/register">Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <MDBContainer className="my-5">
        <MDBCard style={{ border: 'none' }}>
          <MDBRow style={{ background: 'rgb(190, 203, 203)' }} className="g-0 p-3">

            <MDBCol md="6">
              <MDBCardImage src={photo1} alt="login form" className="rounded-start w-100" />
            </MDBCol>

            <MDBCol md="6">
              <MDBCardBody className="d-flex mx-5 flex-column">
                <div className="d-flex flex-row mt-2 mb-5">
                  <span className="h1 fw-bold mb-0">Sign in to your account</span>
                </div>

                <Form onSubmit={handleSubmit}>
                  <label className="form-label" htmlFor="formControlLgEmail">Email</label>
                  <MDBInput
                    required
                    style={{ margin: '5px auto' }}
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    id="formControlLgEmail"
                    type="email"
                    size="md"
                    autoComplete="off"
                  />

                  <label className="form-label" htmlFor="formControlLgPassword">Password</label>
                  <MDBInput
                    required
                    style={{ margin: '5px auto' }}
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    id="formControlLgPassword"
                    type="password"
                    size="md"
                    autoComplete="off"
                  />

                  <Button
                    className="mb-4 px-5 bg-dark"
                    size="lg"
                    type="submit"
                    disabled={loading || !user.email || !user.password}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Form>

                <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                  Don't have an account? <Link to="/register" style={{ color: '#393f81' }}>Register here</Link>
                </p>
              </MDBCardBody>
            </MDBCol>

          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </>
  );
};

export default Login;
