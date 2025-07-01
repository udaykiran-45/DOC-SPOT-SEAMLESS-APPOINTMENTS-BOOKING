import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container } from 'react-bootstrap';
import axios from 'axios';

const AdminAppointments = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/getallAppointmentsAdmin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      if (res.data.success) {
        setAllAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div>
      <h2 className='p-3 text-center'>All Appointments for Admin Panel</h2>
      <Container>
        <Table className='my-3' striped bordered hover>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>User Name</th>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}>Loading appointments...</td></tr>
            ) : allAppointments.length > 0 ? (
              allAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment._id}</td>
                  <td>{appointment.userInfo?.fullName || 'N/A'}</td>
                  <td>{appointment.doctorInfo?.fullName || 'N/A'}</td>
                  <td>{new Date(appointment.date).toLocaleString()}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <Alert variant="info">
                    <Alert.Heading>No Appointments to show</Alert.Heading>
                  </Alert>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default AdminAppointments;
