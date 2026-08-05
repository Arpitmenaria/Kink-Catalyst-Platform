import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { globalSearch, searchGroups, searchGroupPosts, searchGroupMembers, setSearchQuery, clearSearch } from '../../store/slices/searchSlice';
import './GlobalSearch.css';

function SearchIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}

function CloseIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

function UserIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

function GroupSearchPanel({ query, groupId, onResultClick }) {
  const dispatch = useDispatch();
  const { groupPosts, groupMembers } = useSelector((s) => s.search);
  const posts = groupPosts[groupId]?.results ?? [];
  const members = groupMembers[groupId]?.results ?? [];
  const postsLoading = groupPosts[groupId]?.loading ?? false;
  const membersLoading = groupMembers[groupId]?.loading ?? false;

  useEffect(() => {
    if (!query || !groupId) return;
    dispatch(searchGroupPosts({ groupId, q: query, page: 1 }));
    dispatch(searchGroupMembers({ groupId, q: query, page: 1 }));
  }, [dispatch, query, groupId]);

  return (
    <div className="search-group-panel">
      {posts.length > 0 && (
        <div className="search-section">
          <h4 className="search-section-title">Posts</h4>
          <div className="search-results">
            {posts.map((post) => {
              const pid = post._id ?? post.id;
              return (
                <button
                  key={pid}
                  className="search-result-item"
                  onClick={() => onResultClick?.({ type: 'post', data: post })}
                >
                  <div className="search-result-text">
                    <p className="search-result-title">{(post.content ?? '').slice(0, 60)}...</p>
                    <p className="search-result-meta">by {post.author?.name ?? 'Unknown'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {members.length > 0 && (
        <div className="search-section">
          <h4 className="search-section-title">Members</h4>
          <div className="search-results">
            {members.map((member) => {
              const mid = member._id ?? member.id;
              return (
                <button
                  key={mid}
                  className="search-result-item search-result-member"
                  onClick={() => onResultClick?.({ type: 'member', data: member })}
                >
                  <div className="search-result-avatar">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} />
                    ) : (
                      <div className="search-result-avatar-placeholder">
                        <UserIcon />
                      </div>
                    )}
                  </div>
                  <div className="search-result-text">
                    <p className="search-result-title">{member.name}</p>
                    <p className="search-result-meta">{member.role ?? 'Member'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!postsLoading && !membersLoading && posts.length === 0 && members.length === 0 && (
        <p className="search-empty">No results found in this group</p>
      )}
    </div>
  );
}

function GlobalSearchPanel({ query, onResultClick }) {
  const dispatch = useDispatch();
  const { global } = useSelector((s) => s.search);

  useEffect(() => {
    if (!query) return;
    dispatch(globalSearch({ q: query, page: 1 }));
  }, [dispatch, query]);

  return (
    <div className="search-global-panel">
      {global.groups.length > 0 && (
        <div className="search-section">
          <h4 className="search-section-title">Groups</h4>
          <div className="search-results">
            {global.groups.map((group) => {
              const gid = group._id ?? group.id;
              return (
                <button
                  key={gid}
                  className="search-result-item search-result-group"
                  onClick={() => onResultClick?.({ type: 'group', data: group })}
                >
                  <div className="search-result-avatar">
                    {group.coverImage ? (
                      <img src={group.coverImage} alt={group.name} />
                    ) : (
                      <div className="search-result-avatar-placeholder">
                        {(group.name ?? 'G')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="search-result-text">
                    <p className="search-result-title">{group.name}</p>
                    <p className="search-result-meta">{group.memberCount ?? 0} members</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {global.users.length > 0 && (
        <div className="search-section">
          <h4 className="search-section-title">Users</h4>
          <div className="search-results">
            {global.users.map((user) => {
              const uid = user._id ?? user.id;
              return (
                <button
                  key={uid}
                  className="search-result-item search-result-user"
                  onClick={() => onResultClick?.({ type: 'user', data: user })}
                >
                  <div className="search-result-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="search-result-avatar-placeholder">
                        <UserIcon />
                      </div>
                    )}
                  </div>
                  <div className="search-result-text">
                    <p className="search-result-title">{user.name}</p>
                    <p className="search-result-meta">@{user.username ?? 'user'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {global.posts.length > 0 && (
        <div className="search-section">
          <h4 className="search-section-title">Posts</h4>
          <div className="search-results">
            {global.posts.map((post) => {
              const pid = post._id ?? post.id;
              return (
                <button
                  key={pid}
                  className="search-result-item search-result-post"
                  onClick={() => onResultClick?.({ type: 'post', data: post })}
                >
                  <div className="search-result-text">
                    <p className="search-result-title">{(post.content ?? '').slice(0, 60)}...</p>
                    <p className="search-result-meta">by {post.author?.name ?? 'Unknown'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!global.loading && global.groups.length === 0 && global.users.length === 0 && global.posts.length === 0 && (
        <p className="search-empty">No global results found</p>
      )}
    </div>
  );
}

function GlobalSearch({ open, onClose, groupId }) {
  const dispatch = useDispatch();
  const { query } = useSelector((s) => s.search);
  const [localQuery, setLocalQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  function handleSearch(value) {
    setLocalQuery(value);
    if (value.trim()) {
      dispatch(setSearchQuery(value));
    }
  }

  function handleClear() {
    setLocalQuery('');
    dispatch(clearSearch());
  }

  if (!open) return null;

  return (
    <div className="search-overlay">
      <div className="search-modal" ref={ref}>
        <div className="search-header">
          <div className="search-input-wrap">
            <SearchIcon />
            <input
              type="text"
              className="search-input"
              placeholder="Search groups, people, posts..."
              value={localQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            {localQuery && (
              <button className="search-clear" onClick={handleClear}>
                <CloseIcon />
              </button>
            )}
          </div>
          <button className="search-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="search-content">
          {localQuery ? (
            groupId ? (
              <GroupSearchPanel query={localQuery} groupId={groupId} onResultClick={onClose} />
            ) : (
              <GlobalSearchPanel query={localQuery} onResultClick={onClose} />
            )
          ) : (
            <p className="search-hint">Start typing to search...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;
