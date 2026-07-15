// Shared @mention support for post captions, comments, and replies.
//
// Mentions are tracked as { userId, username, offset, length } — offset/length
// point into the *current* text of whichever input they belong to, and are
// exactly what the backend expects back on create (see postsSlice.js).
//
// This app has no dedicated "username" field on users — people are identified
// by fullName — so the mention token inserted into text is the person's first
// name (matches the "@Mark" example from the backend spec), and `username` in
// the tracked mention is that same first-name string so offset/length line up
// exactly with what's rendered.

// Is the cursor currently inside an "@query" being typed? Returns the query
// text and where the "@" started, or null if not in a mention context.
export function getMentionQuery(text, cursor) {
  const upToCursor = text.slice(0, cursor);
  const at = upToCursor.lastIndexOf('@');
  if (at === -1) return null;
  if (at > 0 && !/\s/.test(text[at - 1])) return null; // must start a "word"
  const query = upToCursor.slice(at + 1);
  if (/\s/.test(query)) return null; // whitespace ends the mention query
  return { start: at, query };
}

function commonPrefixLen(a, b) {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return i;
}
function commonSuffixLen(a, b, prefixLen) {
  const max = Math.min(a.length, b.length) - prefixLen;
  let i = 0;
  while (i < max && a[a.length - 1 - i] === b[b.length - 1 - i]) i++;
  return i;
}

// Re-map tracked mention offsets after a text edit (typing/pasting/deleting).
// A mention whose span overlaps the edited region is dropped rather than
// guessed at — better to silently un-mention than point a click at the wrong
// person.
export function shiftMentionsOnEdit(oldText, newText, mentions) {
  if (oldText === newText || mentions.length === 0) return mentions;
  const prefix = commonPrefixLen(oldText, newText);
  const suffix = commonSuffixLen(oldText, newText, prefix);
  const oldEditEnd = oldText.length - suffix;
  const newEditEnd = newText.length - suffix;
  const delta = newEditEnd - oldEditEnd;
  return mentions
    .filter(m => {
      const end = m.offset + m.length;
      return end <= prefix || m.offset >= oldEditEnd;
    })
    .map(m => (m.offset >= oldEditEnd ? { ...m, offset: m.offset + delta } : m));
}

// Insert a mention for `person` at the active "@query" span, returning the
// new text, the tracked mention, and the cursor position to restore focus to.
export function insertMention(text, queryStart, queryEnd, person) {
  const firstName = (person.name ?? person.fullName ?? '').split(' ')[0] || 'User';
  const token = `@${firstName} `;
  const nextText = text.slice(0, queryStart) + token + text.slice(queryEnd);
  const mention = { userId: person.id ?? person._id, username: firstName, offset: queryStart, length: firstName.length + 1 };
  return { text: nextText, mention, cursor: queryStart + token.length };
}

// Drop any tracked mention whose recorded span no longer actually matches
// "@username" in the final text — a last line of defense before submit.
export function validateMentions(text, mentions) {
  return mentions.filter(m => text.slice(m.offset, m.offset + m.length) === `@${m.username}`);
}

// Trim text for submission while keeping mention offsets correct — offsets
// are tracked against the untrimmed input, so trimming leading whitespace
// would silently shift every mention if we didn't account for it here.
export function trimWithMentions(text, mentions) {
  const trimmed = text.trim();
  const leadingTrim = text.length - text.trimStart().length;
  const shifted = mentions.map(m => ({ ...m, offset: m.offset - leadingTrim }));
  return { text: trimmed, mentions: validateMentions(trimmed, shifted) };
}

// Render text as plain runs + colored #hashtag spans + clickable @mention
// spans (using precise backend-provided offsets, not regex guessing).
export function renderTaggedText(text = '', mentions = [], onMentionClick) {
  const spans = [];
  for (const m of mentions) {
    if (typeof m.offset !== 'number' || typeof m.length !== 'number') continue;
    const userId = m.userId ?? m.id;
    if (!userId) continue;
    spans.push({ start: m.offset, end: m.offset + m.length, type: 'mention', userId });
  }
  const hashtagRe = /#[\w]+/g;
  let hm;
  while ((hm = hashtagRe.exec(text)) !== null) {
    const start = hm.index, end = start + hm[0].length;
    if (spans.some(s => start < s.end && end > s.start)) continue;
    spans.push({ start, end, type: 'hashtag' });
  }
  spans.sort((a, b) => a.start - b.start);

  const nodes = [];
  let last = 0;
  spans.forEach((s, i) => {
    if (s.start > last) nodes.push(text.slice(last, s.start));
    const label = text.slice(s.start, s.end);
    if (s.type === 'mention') {
      nodes.push(
        <span
          key={i}
          className="post-caption-tag post-caption-mention"
          style={{ cursor: 'pointer' }}
          onClick={e => { e.stopPropagation(); onMentionClick?.(s.userId); }}
        >{label}</span>
      );
    } else {
      nodes.push(<span key={i} className="post-caption-tag">{label}</span>);
    }
    last = s.end;
  });
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

// Small floating candidate list shown while typing "@query".
export function MentionDropdown({ candidates, onPick }) {
  if (candidates.length === 0) return null;
  return (
    <div className="mention-dropdown">
      {candidates.map(p => {
        const id = p.id ?? p._id;
        const name = p.name ?? p.fullName ?? '';
        const avatar = p.avatar ?? p.avatarUrl ?? '';
        return (
          <button type="button" key={id} className="mention-dropdown-item" onMouseDown={e => { e.preventDefault(); onPick(p); }}>
            <span className="mention-dropdown-avatar" style={{ background: '#3b82f6' }}>
              {avatar ? <img src={avatar} alt="" /> : (name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?')}
            </span>
            <span className="mention-dropdown-name">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
