import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

const UserAppointments = () => {
  const [userId, setUserId] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      const { _id, isdoctor } = user;
      setUserId(_id);
      setIsDoctor(isdoctor);
    } else {
      message.error('No user found. Please login again.');
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    if (isDoctor) {
      fetchDoctorAppointments();
    } else {
      fetchUserAppointments();
    }
  }, [userId, isDoctor]);

  const fetchUserAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/getuserappointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { userId },
      });

      if (res.data.success) {
        setUserAppointments(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch user appointments');
    }
  };

  const fetchDoctorAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctor/getdoctorappointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { userId },
      });

      if (res.data.success) {
        setDoctorAppointments(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch doctor appointments');
    }
  };

  const handleStatus = async (userId, appointmentId, status) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/doctor/handlestatus',
        { userId, appointmentId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        fetchDoctorAppointments();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to update status');
    }
  };

  const handleDownload = async (url, appointId) => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/doctor/getdocumentdownload',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: { appointId },
          responseType: 'blob',
        }
      );

      if (res.data) {
        const fileUrl = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", url.split('/').pop() || 'document.jpg');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        message.error("Download failed");
      }
    } catch (error) {
      console.error(error);
      message.error('Error downloading document');
    }
  };

  return (
    <div>
      <h2 className="p-3 text-center">All Appointments</h2>
      <Container>
        {isDoctor ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Appointment Date</th>
                <th>Phone</th>
                <th>Document</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctorAppointments.length > 0 ? (
                doctorAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.userInfo?.fullName}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.userInfo?.phone}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() =>
                          handleDownload(appointment.document?.path, appointment._id)
                        }
                      >
                        {appointment.document?.filename || 'Download'}
                      </Button>
                    </td>
                    <td>{appointment.status}</td>
                    <td>
                      {appointment.status !== 'approved' && (
                        <Button
                          onClick={() =>
                            handleStatus(
                              appointment.userInfo?._id,
                              appointment._id,
                              'approved'
                            )
                          }
                        >
                          Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <Alert variant="info">No Appointments to show</Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Appointment Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userAppointments.length > 0 ? (
                userAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.docName}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>
                    <Alert variant="info">No Appointments to show</Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default UserAppointments;
