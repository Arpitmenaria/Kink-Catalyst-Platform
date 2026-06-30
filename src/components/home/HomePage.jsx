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
import UserProfilePage from './UserProfilePage';
import MiniSitesPage from './MiniSitesPage';
import { initSocket } from '../../services/socket';
import store from '../../store';
import { fetchMe } from '../../store/slices/authSlice';
import './HomePage.css';

export default function HomePage() {
  const dispatch = useDispatch();
  const { token, user } = useSelector(s => s.auth);

  /* Init socket + resync counts on app load */
  useEffect(() => {
    if (token) {
      initSocket(token, store);
      dispatch(fetchMe());
    }
  }, [token]);

  const [section,         setSection]         = useState('feed');
  const [eventsCreate,    setEventsCreate]    = useState(false);
  const [profileInitTab,  setProfileInitTab]  = useState(null);
  const [viewedUserId,    setViewedUserId]    = useState(null);

  function goToEventsCreate() { setEventsCreate(true); setSection('events'); }
  function goToProfileTab(tab) { setProfileInitTab(tab); setSection('profile'); }

  // Open someone's profile. If it's the logged-in user, send them to their
  // own editable ProfilePage instead of the read-only UserProfilePage.
  function goToUserProfile(userId) {
    if (!userId) return;
    if (userId === user?._id) {
      setSection('profile');
      return;
    }
    setViewedUserId(userId);
    setSection('userProfile');
  }

  // Jump into Messages with a specific person pre-selected (used by the
  // "Message" button on UserProfilePage). MessagesPage needs to accept an
  // `initialUserId` prop and auto-open/create that conversation — wire that
  // up inside MessagesPage if it doesn't already support deep-linking.
  function goToMessagesWithUser(userId) {
    setViewedUserId(userId);
    setSection('messages');
  }

  return (
    <div className={`home-page${section === 'messages' ? ' home-page--chat' : ''}`}>
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
        ) : section === 'userProfile' ? (
          <UserProfilePage
            userId={viewedUserId}
            onBack={() => setSection('feed')}
            onMessageUser={goToMessagesWithUser}
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
            initialUserId={viewedUserId}
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
            <Feed
              onEventsClick={() => setSection('events')}
              onProfileClick={() => setSection('profile')}
              onCreateEvent={goToEventsCreate}
              onUserClick={goToUserProfile}
            />
            <RightSidebar />
          </>
        )}
      </div>
    </div>
  );
}