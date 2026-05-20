import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from '../../store/slices/profileSlice';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import EventsPage from './EventsPage';
import MessagesPage from './MessagesPage';
import GroupsPage from './GroupsPage';
import './HomePage.css';

export default function HomePage() {
  const dispatch = useDispatch();
  const [section, setSection] = useState('feed');

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-body">
        {section === 'events' ? (
          <EventsPage onBack={() => setSection('feed')} />
        ) : section === 'messages' ? (
          <MessagesPage onBack={() => setSection('feed')} />
        ) : section === 'groups' ? (
          <GroupsPage
            onBack={() => setSection('feed')}
            onMessagesClick={() => setSection('messages')}
          />
        ) : (
          <>
            <LeftSidebar
              onEventsClick={() => setSection('events')}
              onMessagesClick={() => setSection('messages')}
              onGroupsClick={() => setSection('groups')}
            />
            <Feed />
            <RightSidebar />
          </>
        )}
      </div>
    </div>
  );
}
