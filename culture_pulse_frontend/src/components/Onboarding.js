import React, { useState } from "react";

/**
 * Onboarding: Supabase sign in/up and Slack/Teams webhook onboarding.
 * On success, user enters app.
 */
const Onboarding = ({ supabase }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState("signin");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [msg, setMsg] = useState(null);

  async function handleAuth() {
    setMsg("");
    let error, data;
    if (mode === "signin") {
      ({ error, data } = await supabase.auth.signInWithPassword({
        email,
        password: pw,
      }));
    } else {
      ({ error, data } = await supabase.auth.signUp({
        email,
        password: pw,
        options: {
          emailRedirectTo: process.env.REACT_APP_SITE_URL + "/confirm",
        },
      }));
    }
    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Check your inbox to confirm or wait for redirect…");
    }
  }

  async function saveWebhook() {
    // Persist webhook for this user/org (assumes backend table or endpoint)
    await supabase.from("webhook_urls").upsert([
      { user_email: email, url: webhookUrl }
    ]);
    setWebhookSaved(true);
    setMsg("Webhook saved! You're all set for notifications.");
  }

  return (
    <div className="onboarding-container">
      <h1>Sign {mode === "signin" ? "In" : "Up"} to CulturePulse</h1>
      <input
        type="email"
        placeholder="Work email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoFocus
      />
      <input
        type="password"
        placeholder="Password"
        value={pw}
        onChange={e => setPw(e.target.value)}
      />
      <button onClick={handleAuth}>
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </button>
      <p>
        {mode === "signin"
          ? <>Don't have an account? <span className="link" onClick={() => setMode("signup")}>Sign Up</span></>
          : <>Already have an account? <span className="link" onClick={() => setMode("signin")}>Sign In</span></>}
      </p>
      {!webhookSaved && (
        <>
          <h2>Connect Slack or Teams</h2>
          <input
            type="url"
            placeholder="Paste Slack/Teams Webhook URL"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
          />
          <button onClick={saveWebhook} disabled={!webhookUrl}>Save Webhook</button>
        </>
      )}
      {msg && <div className="info-msg">{msg}</div>}
    </div>
  );
};

export default Onboarding;
