import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { message } from 'antd';
import p2 from '../../images/p2.png';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
} from 'mdb-react-ui-kit';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    type: '',
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    const { fullName, email, password, phone, type } = user;
    if (!fullName || !email || !password || !phone || !type) {
      return message.error('Please fill in all the fields.');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/user/register', user);
      if (res.data.success) {
        message.success('Registered Successfully');
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
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
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll />
            <Nav>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <MDBContainer className="my-5">
        <MDBCard style={{ border: 'none' }}>
          <MDBRow style={{ background: 'rgb(190, 203, 203)' }} className="g-0 p-3">

            <MDBCol md="6">
              <MDBCardBody className="d-flex mx-3 flex-column">
                <div className="d-flex flex-row mb-2">
                  <span className="h1 text-center fw-bold">Sign up to your account</span>
                </div>

                <div className="p-2">
                  <Form onSubmit={handleSubmit}>
                    <label className="my-1 form-label" htmlFor="inputFullName">Full Name</label>
                    <MDBInput
                      id="inputFullName"
                      name="fullName"
                      value={user.fullName}
                      onChange={handleChange}
                      type="text"
                      size="sm"
                      style={{ height: '40px' }}
                    />

                    <label className="my-1 form-label" htmlFor="inputEmail">Email</label>
                    <MDBInput
                      id="inputEmail"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      type="email"
                      size="sm"
                      style={{ height: '40px' }}
                    />

                    <label className="my-1 form-label" htmlFor="inputPassword">Password</label>
                    <MDBInput
                      id="inputPassword"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      type="password"
                      size="sm"
                      style={{ height: '40px' }}
                    />

                    <label className="my-1 form-label" htmlFor="inputPhone">Phone</label>
                    <MDBInput
                      id="inputPhone"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      type="tel"
                      size="sm"
                      style={{ height: '40px' }}
                    />

                    <Container className="my-3">
                      <MDBRadio
                        name="type"
                        id="radioAdmin"
                        checked={user.type === 'admin'}
                        value="admin"
                        onChange={handleChange}
                        label="Admin"
                        inline
                      />
                      <MDBRadio
                        name="type"
                        id="radioUser"
                        checked={user.type === 'user'}
                        value="user"
                        onChange={handleChange}
                        label="User"
                        inline
                      />
                    </Container>

                    <Button
                      style={{ marginTop: '20px' }}
                      className="mb-4 bg-dark"
                      variant="dark"
                      size="lg"
                      type="submit"
                    >
                      Register
                    </Button>
                  </Form>

                  <p className="mb-5 pb-md-2" style={{ color: '#393f81' }}>
                    Have an account?{' '}
                    <Link to="/login" style={{ color: '#393f81' }}>
                      Login here
                    </Link>
                  </p>
                </div>
              </MDBCardBody>
            </MDBCol>

            <MDBCol md="6">
              <MDBCardImage
                style={{ mixBlendMode: 'darken' }}
                src={p2}
                alt="register form"
                className="rounded-start w-100"
              />
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </>
  );
};

export default Register;
