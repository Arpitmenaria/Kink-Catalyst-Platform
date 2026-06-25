import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import EventsPage from './EventsPage';
import MessagesPage from './MessagesPage';
import GroupsPage from './GroupsPage';
import CalendarPage from './CalendarPage';
import CoursesPage from './CoursesPage';
import LibraryPage from './LibraryPage';
import ProfilePage from './ProfilePage';
import MiniSitesPage from './MiniSitesPage';
import { initSocket } from '../../services/socket';
import store from '../../store';
import './HomePage.css';

export default function HomePage() {
  const dispatch = useDispatch();
  const { token } = useSelector(s => s.auth);

  /* Init socket once at app level so notifications arrive on any screen */
  useEffect(() => {
    if (token) initSocket(token, store);
  }, [token]);

  const [section,         setSection]         = useState('feed');
  const [eventsCreate,    setEventsCreate]    = useState(false);
  const [profileInitTab,  setProfileInitTab]  = useState(null);

  function goToEventsCreate() { setEventsCreate(true); setSection('events'); }
  function goToProfileTab(tab) { setProfileInitTab(tab); setSection('profile'); }

  return (
    <div className="home-page">
      <Navbar onMessagesClick={() => setSection('messages')} onProfileClick={() => setSection('profile')} onConnectionsClick={() => goToProfileTab('Connections')} onPostsClick={() => goToProfileTab('Feed')} />
      <div className="home-body">
        {section === 'minisites' ? (
          <MiniSitesPage
            onBack={() => setSection('feed')}
            onCoursesClick={() => setSection('courses')}
            onLibraryClick={() => setSection('library')}
            onEventsClick={() => setSection('events')}
            onGroupsClick={() => setSection('groups')}
            onMessagesClick={() => setSection('messages')}
            onCalendarClick={() => setSection('calendar')}
            onMinisitesClick={() => setSection('minisites')}
          />
        ) : section === 'profile' ? (
          <ProfilePage
            onBack={() => setSection('feed')}
            onCoursesClick={() => setSection('courses')}
            onLibraryClick={() => setSection('library')}
            onEventsClick={() => setSection('events')}
            onEventsCreateClick={goToEventsCreate}
            onGroupsClick={() => setSection('groups')}
            onMessagesClick={() => setSection('messages')}
            onCalendarClick={() => setSection('calendar')}
            onMinisitesClick={() => setSection('minisites')}
            initialTab={profileInitTab}
            onInitTabConsumed={() => setProfileInitTab(null)}
          />
        ) : section === 'library' ? (
          <LibraryPage
            onBack={() => setSection('feed')}
            onCoursesClick={() => setSection('courses')}
            onEventsClick={() => setSection('events')}
            onGroupsClick={() => setSection('groups')}
            onCalendarClick={() => setSection('calendar')}
            onMessagesClick={() => setSection('messages')}
            onMinisitesClick={() => setSection('minisites')}
          />
        ) : section === 'courses' ? (
          <CoursesPage
            onBack={() => setSection('feed')}
            onLibraryClick={() => setSection('library')}
            onEventsClick={() => setSection('events')}
            onGroupsClick={() => setSection('groups')}
            onCalendarClick={() => setSection('calendar')}
            onMessagesClick={() => setSection('messages')}
            onMinisitesClick={() => setSection('minisites')}
          />
        ) : section === 'events' ? (
          <EventsPage
            onBack={() => { setEventsCreate(false); setSection('feed'); }}
            onCoursesClick={() => setSection('courses')}
            onLibraryClick={() => setSection('library')}
            onEventsClick={() => setSection('events')}
            onGroupsClick={() => setSection('groups')}
            onCalendarClick={() => setSection('calendar')}
            onMessagesClick={() => setSection('messages')}
            onMinisitesClick={() => setSection('minisites')}
            startCreate={eventsCreate}
          />
        ) : section === 'messages' ? (
          <MessagesPage
            onBack={() => setSection('feed')}
            onCoursesClick={() => setSection('courses')}
            onLibraryClick={() => setSection('library')}
            onEventsClick={() => setSection('events')}
            onGroupsClick={() => setSection('groups')}
            onCalendarClick={() => setSection('calendar')}
            onMinisitesClick={() => setSection('minisites')}
          />
        ) : section === 'groups' ? (
          <GroupsPage
            onBack={() => setSection('feed')}
            onCoursesClick={() => setSection('courses')}
            onLibraryClick={() => setSection('library')}
            onEventsClick={() => setSection('events')}
            onCalendarClick={() => setSection('calendar')}
            onMessagesClick={() => setSection('messages')}
            onMinisitesClick={() => setSection('minisites')}
          />
        ) : section === 'calendar' ? (
          <CalendarPage
            onFeedClick={() => setSection('feed')}
            onCoursesClick={() => setSection('courses')}
            onLibraryClick={() => setSection('library')}
            onEventsClick={() => setSection('events')}
            onGroupsClick={() => setSection('groups')}
            onMessagesClick={() => setSection('messages')}
            onMinisitesClick={() => setSection('minisites')}
          />
        ) : (
          <>
            <LeftSidebar
              onCoursesClick={() => setSection('courses')}
              onLibraryClick={() => setSection('library')}
              onEventsClick={() => setSection('events')}
              onMessagesClick={() => setSection('messages')}
              onGroupsClick={() => setSection('groups')}
              onCalendarClick={() => setSection('calendar')}
              onProfileClick={() => setSection('profile')}
              onMinisitesClick={() => setSection('minisites')}
            />
            <Feed onEventsClick={() => setSection('events')} onProfileClick={() => setSection('profile')} onCreateEvent={goToEventsCreate} />
            <RightSidebar />
          </>
        )}
      </div>
    </div>
  );
}
