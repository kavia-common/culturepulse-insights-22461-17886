import React from "react";
import "../styles/DailyFeed.css";

/**
 * DailyFeed: shows recent team moods. 
 * Only admin sees notes.
 * feed: [{ user_name, mood, note, created_at }]
 */
const DailyFeed = ({ feed, showNotes }) => {
  return (
    <div className="daily-feed">
      <h3>Daily Mood Feed</h3>
      <ul>
        {(feed || []).map((entry, ix) => (
          <li key={ix}>
            <div className="feed-row">
              <span className="feed-mood">{["😢", "😞", "😐", "🙂", "😃"][Math.round(entry.mood) - 1]}</span>
              <span className="feed-user">{entry.user_name}</span>
              <span className="feed-date">
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
            </div>
            {showNotes && entry.note && (
              <div className="feed-note">{entry.note}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyFeed;
