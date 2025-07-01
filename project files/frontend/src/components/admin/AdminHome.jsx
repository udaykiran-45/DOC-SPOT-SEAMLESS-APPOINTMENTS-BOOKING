import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Badge } from 'antd';
import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicationIcon from '@mui/icons-material/Medication';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Notification from '../common/Notification';
import AdminUsers from './AdminUsers';
import AdminDoctors from './AdminDoctors';
import AdminAppointments from './AdminAppointments';

const AdminHome = () => {
  const [userdata, setUserData] = useState({});
  const [activeMenuItem, setActiveMenuItem] = useState('adminappointments'); // default tab

  const getUserData = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/getuserdata', {}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token')
        },
      });
      if (res.data.success) {
        setUserData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserData(user);
    }
  };

  useEffect(() => {
    getUserData();
    getUser();
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
              className={`menu-items ${activeMenuItem === 'adminusers' ? 'active' : ''}`}
              onClick={() => handleMenuItemClick('adminusers')}
              style={{ cursor: 'pointer' }}
            >
              <CalendarMonthIcon className='icon' />
              <span>Users</span>
            </div>
            <div
              className={`menu-items ${activeMenuItem === 'admindoctors' ? 'active' : ''}`}
              onClick={() => handleMenuItemClick('admindoctors')}
              style={{ cursor: 'pointer' }}
            >
              <MedicationIcon className='icon' />
              <span>Doctors</span>
            </div>
            <div
              className="menu-items"
              onClick={logout}
              style={{ cursor: 'pointer' }}
            >
              <LogoutIcon className='icon' />
              <span>Logout</span>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            <div className="header-content" style={{ cursor: 'pointer' }}>
              <Badge
                className={`notify ${activeMenuItem === 'notification' ? 'active' : ''}`}
                onClick={() => handleMenuItemClick('notification')}
                count={userdata?.notification ? userdata.notification.length : 0}
              >
                <NotificationsIcon className='icon' />
              </Badge>
              <h3>Hi.. {userdata.fullName}</h3>
            </div>
          </div>
          <div className="body">
            {activeMenuItem === 'notification' && <Notification />}
            {activeMenuItem === 'adminusers' && <AdminUsers />}
            {activeMenuItem === 'admindoctors' && <AdminDoctors />}
            {activeMenuItem !== 'notification' && activeMenuItem !== 'adminusers' && activeMenuItem !== 'admindoctors' && <AdminAppointments />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
