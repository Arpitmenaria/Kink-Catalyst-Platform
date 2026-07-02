import { useState } from 'react';
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
import './HomePage.css';

export default function HomePage() {
  const [section,         setSection]         = useState('feed');
  const [eventsCreate,    setEventsCreate]    = useState(false);
  const [profileInitTab,  setProfileInitTab]  = useState(null);
  const [viewedUserId,    setViewedUserId]    = useState(null);
  const [viewedGroupId,   setViewedGroupId]   = useState(null);
  const [viewedEventId,   setViewedEventId]   = useState(null);
  const [profileReturnSection, setProfileReturnSection] = useState('feed');

  function goToEventsCreate() { setEventsCreate(true); setSection('events'); }
  function goToProfileTab(tab) { setProfileInitTab(tab); setSection('profile'); }

  function goToUserProfile(userId) {
    if (!userId) return;
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
            onUserClick={goToUserProfile}
          />
        ) : section === 'userProfile' ? (
          <UserProfilePage
            userId={viewedUserId}
            onBack={() => setSection(profileReturnSection)}
            onMessageUser={() => setSection('messages')}
            onEventsClick={() => setSection('events')}
            onGroupsClick={() => setSection('groups')}
            onLibraryClick={() => setSection('library')}
            onMinisitesClick={() => setSection('minisites')}
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
            initialGroupId={viewedGroupId}
            onInitGroupConsumed={() => setViewedGroupId(null)}
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
            />
            <Feed onEventsClick={() => setSection('events')} onProfileClick={() => setSection('profile')} onCreateEvent={goToEventsCreate} onUserClick={goToUserProfile} />
            <RightSidebar />
          </>
        )}
      </div>
    </div>
  );
}
