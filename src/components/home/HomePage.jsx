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
import { consumeJustSelectedPlan } from '../../store/slices/plansSlice';
import './HomePage.css';

export default function HomePage() {
  const dispatch = useDispatch();
  const { token, user } = useSelector(s => s.auth);
  const { justSelectedPlan } = useSelector(s => s.plans);

  /* Init socket + resync counts on app load */
  useEffect(() => {
    if (token) {
      initSocket(token, store);
      dispatch(fetchMe());
    }
  }, [token]);

  const [section,         setSection]         = useState('feed');
  const [eventsCreate,    setEventsCreate]    = useState(false);
  const [groupsCreate,    setGroupsCreate]    = useState(false);
  const [profileInitTab,  setProfileInitTab]  = useState(null);
  const [profileAutoEdit, setProfileAutoEdit] = useState(false);
  const [viewedUserId,    setViewedUserId]    = useState(null);
  const [viewedGroupId,   setViewedGroupId]   = useState(null);
  const [viewedEventId,   setViewedEventId]   = useState(null);
  const [profileReturnSection, setProfileReturnSection] = useState('feed');

  // Just came from signup → plan selection: land on Profile → About with
  // Personal Information edit mode already open so the user can fill it in.
  useEffect(() => {
    if (!justSelectedPlan) return;
    setProfileInitTab('About');
    setProfileAutoEdit(true);
    setSection('profile');
    dispatch(consumeJustSelectedPlan());
  }, [justSelectedPlan]);

  function goToEventsCreate() { setEventsCreate(true); setSection('events'); }
  function goToGroupsCreate() { setGroupsCreate(true); setSection('groups'); }
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
    setProfileReturnSection(section);
    setSection('userProfile');
  }

  function goToGroup(groupId) {
    if (!groupId) return;
    setViewedGroupId(groupId);
    setSection('groups');
  }

  function goToEvent(eventId) {
    if (!eventId) return;
    setViewedEventId(eventId);
    setSection('events');
  }

  // Jump into Messages with a specific person pre-selected (used by the
  // "Message" button on UserProfilePage).
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
            autoEditPersonal={profileAutoEdit}
            onAutoEditConsumed={() => setProfileAutoEdit(false)}
            onUserClick={goToUserProfile}
            onEventClick={goToEvent}
            onMessageUser={goToMessagesWithUser}
          />
        ) : section === 'userProfile' ? (
          <UserProfilePage
            userId={viewedUserId}
            onBack={() => setSection(profileReturnSection)}
            onMessageUser={goToMessagesWithUser}
            onEventsClick={() => setSection('events')}
            onEventsCreateClick={goToEventsCreate}
            onGroupsClick={() => setSection('groups')}
            onCoursesClick={() => setSection('courses')}
            onLibraryClick={() => setSection('library')}
            onMinisitesClick={() => setSection('minisites')}
            onUserClick={goToUserProfile}
            onEventClick={goToEvent}
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
            initialEventId={viewedEventId}
            onInitEventConsumed={() => setViewedEventId(null)}
            onUserClick={goToUserProfile}
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
            onInitUserConsumed={() => setViewedUserId(null)}
          />
        ) : section === 'groups' ? (
          <GroupsPage
            onBack={() => { setGroupsCreate(false); setSection('feed'); }}
            onCoursesClick={() => setSection('courses')}
            onLibraryClick={() => setSection('library')}
            onEventsClick={() => setSection('events')}
            onCalendarClick={() => setSection('calendar')}
            onMessagesClick={() => setSection('messages')}
            onMinisitesClick={() => setSection('minisites')}
            initialGroupId={viewedGroupId}
            onInitGroupConsumed={() => setViewedGroupId(null)}
            startCreate={groupsCreate}
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
              onGroupClick={goToGroup}
              onEventClick={goToEvent}
              onUserClick={goToUserProfile}
              onCreateGroup={goToGroupsCreate}
              onCreateEvent={goToEventsCreate}
            />
            <Feed
              onEventsClick={() => setSection('events')}
              onProfileClick={() => setSection('profile')}
              onCreateEvent={goToEventsCreate}
              onUserClick={goToUserProfile}
            />
            <RightSidebar onCoursesClick={() => setSection('courses')} />
          </>
        )}
      </div>
    </div>
  );
}