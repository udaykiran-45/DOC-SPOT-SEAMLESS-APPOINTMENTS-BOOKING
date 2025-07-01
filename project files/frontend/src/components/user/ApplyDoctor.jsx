import { Col, Form, Input, Row, TimePicker, message } from 'antd';
import { Container } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';

function ApplyDoctor({ userId }) {
  const [doctor, setDoctor] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    experience: '',
    fees: '',
    timings: [],
  });

  // Handle change for all text inputs
  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  // Handle change for TimePicker
  const handleTimingChange = (value) => {
    if (value) {
      const formatted = value.map(time => time.format('HH:mm'));
      setDoctor({ ...doctor, timings: formatted });
    }
  };

  const handleSubmit = async () => {
    const {
      fullName, email, phone, address, specialization, experience, fees, timings,
    } = doctor;

    // Simple frontend validation
    if (
      !fullName || !email || !phone || !address ||
      !specialization || !experience || !fees || timings.length !== 2
    ) {
      return message.error('Please fill in all fields including timings.');
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/user/registerdoc',
        { doctor, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong. Please try again.');
    }
  };

  return (
    <Container>
      <h2 className="text-center p-3">Apply for Doctor</h2>
      <Form onFinish={handleSubmit} layout="vertical" className="m-3">
        <h4>Personal Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Full Name" required>
              <Input name="fullName" value={doctor.fullName} onChange={handleChange} placeholder="Enter name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Phone" required>
              <Input name="phone" value={doctor.phone} onChange={handleChange} type="tel" placeholder="Your phone" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Email" required>
              <Input name="email" value={doctor.email} onChange={handleChange} type="email" placeholder="Your email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Address" required>
              <Input name="address" value={doctor.address} onChange={handleChange} placeholder="Your address" />
            </Form.Item>
          </Col>
        </Row>

        <h4>Professional Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Specialization" required>
              <Input name="specialization" value={doctor.specialization} onChange={handleChange} placeholder="Your specialization" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Experience (in years)" required>
              <Input name="experience" value={doctor.experience} onChange={handleChange} type="number" placeholder="Experience" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Fees (₹)" required>
              <Input name="fees" value={doctor.fees} onChange={handleChange} type="number" placeholder="Consultation fees" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Available Timings" required>
              <TimePicker.RangePicker format="HH:mm" onChange={handleTimingChange} />
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" type="submit">Submit</button>
        </div>
      </Form>
    </Container>
  );
}

export default ApplyDoctor;
