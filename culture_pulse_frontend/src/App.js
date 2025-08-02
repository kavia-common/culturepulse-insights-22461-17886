import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Onboarding from "./components/Onboarding";
import Subscription from "./components/Subscription";
import AdminPanel from "./components/AdminPanel";
import Sidebar from "./components/Sidebar";
import "./App.css";

/**
 * Loads Supabase credentials from environment variables.
 */
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// PUBLIC_INTERFACE
function App() {
  // session handles auth state for the user's session
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme handling
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Supabase Auth session listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => subscription.unsubscribe();
  }, []);

  // Loads logged-in user's profile/role (pseudo code; replace with backend call as needed)
  useEffect(() => {
    async function fetchProfile() {
      if (session) {
        // Fetch the user's profile to check roles and permissions
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (!error) setProfile(data);
      } else {
        setProfile(null);
      }
    }
    fetchProfile();
  }, [session]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Render: If loading or not authenticated, show only onboarding, subscription, or login.
  if (loading) return (<div>Loading…</div>);
  if (!session)
    return (
      <div className="auth-container">
        <Onboarding supabase={supabase} />
      </div>
    );
  // If trial expired or stripe subscription inactive - render lockout/Subscription component
  if (profile && profile.trial_expired && !profile.stripe_active) {
    return (
      <Subscription
        supabase={supabase}
        profile={profile}
        session={session}
      />
    );
  }

  // Role-based access control (admins get extra sidebar/views)
  const isAdmin = profile && profile.role === "admin";

  return (
    <Router>
      <div className="App">
        <Sidebar isAdmin={isAdmin} profile={profile} />
        <main className="main-content">
          <header className="App-header">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            <h1>CulturePulse</h1>
            <span className="user-email">
              {session.user.email}
            </span>
          </header>
          <Routes>
            <Route path="/" element={<Dashboard supabase={supabase} profile={profile} session={session} />} />
            <Route path="/admin" element={isAdmin ? <AdminPanel supabase={supabase} profile={profile} /> : <Navigate to="/" />} />
            <Route path="/subscription" element={<Subscription supabase={supabase} profile={profile} session={session} />} />
            <Route path="*" element={<Dashboard supabase={supabase} profile={profile} session={session} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
