import React, { useEffect, useState } from 'react';
import { Badge, Row, message } from 'antd';
import Notification from '../common/Notification';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicationIcon from '@mui/icons-material/Medication';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Container } from 'react-bootstrap';

import ApplyDoctor from './ApplyDoctor';
import UserAppointments from './UserAppointments';
import DoctorList from './DoctorList';

const UserHome = () => {
  const [doctors, setDoctors] = useState([]);
  const [userdata, setUserData] = useState({});
  const [activeMenuItem, setActiveMenuItem] = useState('userappointments');

  const getUserData = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/getuserdata', {}, {
        headers: { Authorization: "Bearer " + localStorage.getItem('token') },
      });
      if (res.data.success) {
        setUserData(res.data.data);
      } else {
        message.error(res.data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong while fetching user data');
    }
  };

  const getDoctorData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/getalldoctorsu', {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token')
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
        message.error(res.data.message || 'Failed to fetch doctors');
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong while fetching doctor data');
    }
  };

  useEffect(() => {
    getUserData();
    getDoctorData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  return (
    <div className='main'>
      <div className="layout">
        <div className="sidebar">
          <div className="logo">
            <h2>BOOK MY DOCTOR</h2>
          </div>
          <div className="menu">
            <div
              className={`menu-items ${activeMenuItem === 'userappointments' ? 'active' : ''}`}
              onClick={() => handleMenuItemClick('userappointments')}
            >
              <CalendarMonthIcon className='icon' />
              <span>Appointments</span>
            </div>
            {!userdata.isdoctor && (
              <div
                className={`menu-items ${activeMenuItem === 'applyDoctor' ? 'active' : ''}`}
                onClick={() => handleMenuItemClick('applyDoctor')}
              >
                <MedicationIcon className='icon' />
                <span>Apply Doctor</span>
              </div>
            )}
            <div
              className={`menu-items ${activeMenuItem === 'notification' ? 'active' : ''}`}
              onClick={() => handleMenuItemClick('notification')}
            >
              <NotificationsIcon className='icon' />
              <span>Notifications</span>
              <Badge count={userdata?.notification?.length || 0} />
            </div>
            <div className="menu-items" onClick={logout}>
              <LogoutIcon className='icon' />
              <span>Logout</span>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="header">
            <div className="header-content">
              {userdata.isdoctor && <h3>Dr. {userdata.fullName}</h3>}
              {!userdata.isdoctor && <h3>{userdata.fullName}</h3>}
            </div>
          </div>

          <div className="body">
            {activeMenuItem === 'applyDoctor' && <ApplyDoctor userId={userdata._id} />}
            {activeMenuItem === 'notification' && <Notification />}
            {activeMenuItem === 'userappointments' && <UserAppointments />}
            {activeMenuItem === 'home' || !['applyDoctor', 'notification', 'userappointments'].includes(activeMenuItem) ? (
              <Container>
                <h2 className="text-center p-2">Home</h2>
                {!userdata.isdoctor && (
                  <Row>
                    {doctors.map((doctor, i) => (
                      <DoctorList
                        key={i}
                        userDoctorId={doctor?.userId}
                        doctor={doctor}
                        userdata={userdata}
                      />
                    ))}
                  </Row>
                )}
              </Container>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
