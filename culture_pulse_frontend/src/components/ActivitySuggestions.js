import React from "react";
import "../styles/ActivitySuggestions.css";

/**
 * ActivitySuggestions: card suggestions for team
 * Props: suggestions: [{ suggestion, created_at }]
 */
const ActivitySuggestions = ({ suggestions }) => {
  return (
    <div className="activity-suggestions">
      <h3>Activity Suggestions</h3>
      <ul>
        {(suggestions || []).map((item, ix) => (
          <li key={ix} className="suggestion-card">
            <span>💡 {item.suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivitySuggestions;
