import React, { useEffect, useState } from 'react';
import { Button, Table, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/getalldoctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong while fetching doctors');
    }
  };

  const handleApprove = async (doctorId, status, userid) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/getapprove', { doctorId, status, userid }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        message.success(res.data.message);
        getDoctors();  // Refresh doctors after approval
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong while approving');
    }
    setLoading(false);
  };

  const handleReject = async (doctorId, status, userid) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/getreject', { doctorId, status, userid }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        message.success(res.data.message);
        getDoctors();  // Refresh doctors after rejection
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong while rejecting');
    }
    setLoading(false);
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <div>
      <h2 className='p-3 text-center'>All Doctors</h2>
      <Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Key</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? (
              doctors.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    {user.status === 'pending' ? (
                      <>
                        <Button
                          onClick={() => handleApprove(user._id, 'approved', user.userId)}
                          className='mx-2'
                          size='sm'
                          variant="outline-success"
                          disabled={loading}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(user._id, 'rejected', user.userId)}
                          className='mx-2'
                          size='sm'
                          variant="outline-danger"
                          disabled={loading}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <span>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <Alert variant="info">
                    <Alert.Heading>No Doctors to show</Alert.Heading>
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

export default AdminDoctors;
