import { message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

const DoctorList = ({ userDoctorId, doctor, userdata }) => {
  const [dateTime, setDateTime] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [show, setShow] = useState(false);

  const currentDate = new Date().toISOString().slice(0, 16); // For min attr

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    setDateTime(event.target.value);
  };

  const handleDocumentChange = (event) => {
    setDocumentFile(event.target.files[0]);
  };

  const handleBook = async (e) => {
    e.preventDefault();

    if (!dateTime || !documentFile) {
      return message.error('Please select a date and upload a document.');
    }

    try {
      const formattedDateTime = dateTime.replace('T', ' ');
      const formData = new FormData();

      formData.append('image', documentFile);
      formData.append('date', formattedDateTime);
      formData.append('userId', userDoctorId);
      formData.append('doctorId', doctor._id);
      formData.append('userInfo', JSON.stringify(userdata));
      formData.append('doctorInfo', JSON.stringify(doctor));

      const res = await axios.post(
        'http://localhost:5000/api/user/getappointment',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        handleClose(); // close modal on success
        setDateTime('');
        setDocumentFile(null);
      } else {
        message.error(res.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Dr. {doctor.fullName}</Card.Title>
          <Card.Text><b>Phone:</b> {doctor.phone}</Card.Text>
          <Card.Text><b>Address:</b> {doctor.address}</Card.Text>
          <Card.Text><b>Specialization:</b> {doctor.specialization}</Card.Text>
          <Card.Text><b>Experience:</b> {doctor.experience} Yrs</Card.Text>
          <Card.Text><b>Fees:</b> ₹{doctor.fees}</Card.Text>
          <Card.Text><b>Timing:</b> {doctor.timings?.[0]} - {doctor.timings?.[1]}</Card.Text>
          <Button variant="primary" onClick={handleShow}>
            Book Now
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Book Appointment</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleBook}>
              <Modal.Body>
                <strong><u>Doctor Details:</u></strong><br />
                Name: {doctor.fullName}
                <hr />
                Specialization: <b>{doctor.specialization}</b>
                <hr />
                <Row className='mb-3'>
                  <Col md={{ span: 8, offset: 2 }}>
                    <Form.Group controlId="appointmentDateTime" className="mb-3">
                      <Form.Label>Appointment Date & Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={dateTime}
                        min={currentDate}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="documentUpload" className="mb-3">
                      <Form.Label>Upload Document (image only)</Form.Label>
                      <Form.Control
                        accept="image/*"
                        type="file"
                        onChange={handleDocumentChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Book
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Card.Body>
      </Card>
    </>
  );
};

export default DoctorList;
