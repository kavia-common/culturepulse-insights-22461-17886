import React, { useEffect, useState } from "react";
import MoodHeatmap from "./MoodHeatmap";
import KPICards from "./KPICards";
import DailyFeed from "./DailyFeed";
import ActivitySuggestions from "./ActivitySuggestions";
import "../styles/Dashboard.css";

/**
 * Dashboard screen: gradient header, KPIs, D3 heatmap, feed, and suggestions.
 * Handles privacy for notes (admin only).
 */
const Dashboard = ({ supabase, profile, session }) => {
  // State: mood data, KPIs, feed
  const [moodData, setMoodData] = useState([]);
  const [kpis, setKpis] = useState({});
  const [feed, setFeed] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data from Supabase backend
  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      // Fetch moods
      const { data: moods } = await supabase
        .from("moods")
        .select("*")
        .order("created_at", { ascending: false });
      // Fetch KPIs (pseudo: backend could calculate)
      const { data: kpiRow } = await supabase
        .from("dashboard_kpis")
        .select("*")
        .maybeSingle();
      // Feed and suggestions
      const { data: feedData } = await supabase
        .from("daily_feed")
        .select("*")
        .limit(10)
        .order("created_at", { ascending: false });
      const { data: suggestionsData } = await supabase
        .from("activity_suggestions")
        .select("*")
        .limit(3);
      setMoodData(moods || []);
      setKpis(kpiRow || {});
      setFeed(feedData || []);
      setSuggestions(suggestionsData || []);
      setLoading(false);
    }
    fetchDashboard();
    // Listen for mood changes (optimistic update: to be replaced with realtime subscription)
  }, [supabase]);

  // Privacy logic: filter notes
  const isAdmin = profile && profile.role === "admin";

  return (
    <div className="dashboard">
      <div className="dashboard-header-gradient">
        <h2>Team Mood Overview</h2>
        <p className="subtitle">See how your team is feeling today & this week.</p>
      </div>
      <KPICards kpis={kpis} accent="#f472b6" />
      <div className="dashboard-content-row">
        <section className="heatmap-section">
          <MoodHeatmap data={moodData} />
        </section>
        <section className="feed-section">
          <DailyFeed feed={feed} showNotes={isAdmin} />
          <ActivitySuggestions suggestions={suggestions} />
        </section>
      </div>
      {loading && <div>Loading data…</div>}
    </div>
  );
};

export default Dashboard;
