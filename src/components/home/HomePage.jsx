import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from '../../store/slices/profileSlice';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import './HomePage.css';

export default function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-body">
        <LeftSidebar />
        <Feed />
        <RightSidebar />
      </div>
    </div>
  );
}
