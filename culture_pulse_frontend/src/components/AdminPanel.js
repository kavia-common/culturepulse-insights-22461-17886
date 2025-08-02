import React from "react";

/**
 * AdminPanel for admin-only dashboard.
 * Extend as needed to add admin analytics or management.
 */
const AdminPanel = ({ supabase, profile }) => {
  return (
    <div className="admin-panel-container">
      <h2>Admin Dashboard</h2>
      <p>Here you can manage team members, view analytics, and adjust settings.</p>
      {/* Add admin controls as needed */}
    </div>
  );
};

export default AdminPanel;
