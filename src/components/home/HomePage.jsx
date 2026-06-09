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
import MiniSitesPage from './MiniSitesPage';
import './HomePage.css';

export default function HomePage() {
  const [section, setSection] = useState('feed');

  return (
    <div className="home-page">
      <Navbar onMessagesClick={() => setSection('messages')} onProfileClick={() => setSection('profile')} />
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
            onGroupsClick={() => setSection('groups')}
            onMessagesClick={() => setSection('messages')}
            onCalendarClick={() => setSection('calendar')}
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
            onBack={() => setSection('feed')}
            onCoursesClick={() => setSection('courses')}
            onLibraryClick={() => setSection('library')}
            onEventsClick={() => setSection('events')}
            onGroupsClick={() => setSection('groups')}
            onCalendarClick={() => setSection('calendar')}
            onMessagesClick={() => setSection('messages')}
            onMinisitesClick={() => setSection('minisites')}
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
            <Feed onEventsClick={() => setSection('events')} onProfileClick={() => setSection('profile')} />
            <RightSidebar />
          </>
        )}
      </div>
    </div>
  );
}
