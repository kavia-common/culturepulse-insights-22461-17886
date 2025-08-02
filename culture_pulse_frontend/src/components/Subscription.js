import React, { useEffect, useState } from "react";

/**
 * Handles Stripe checkout for trial/paid, and shows lockout if trial expired.
 * Expects backend provides Stripe portal/checkout URLs.
 */
const Subscription = ({ supabase, profile, session }) => {
  const [portalUrl, setPortalUrl] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    async function getPortalUrl() {
      // Backend function or REST endpoint should provide Stripe portal/checkout.
      const { data, error } = await supabase
        .rpc("get_stripe_portal_url", { user_id: session.user.id });
      if (data?.url) setPortalUrl(data.url);
      if (error) setErrMsg("Unable to fetch Stripe subscription portal.");
    }
    if (profile && (!profile.stripe_active || profile.trial_expired)) {
      getPortalUrl();
    }
  }, [profile, session, supabase]);

  if (!profile) return null;

  // Trial expired
  if (profile.trial_expired && !profile.stripe_active) {
    return (
      <div className="subscription-lockout">
        <h2>Trial Ended</h2>
        <p>Your trial has expired. Please subscribe to continue using CulturePulse.</p>
        {portalUrl && (
          <a href={portalUrl} className="stripe-btn" target="_blank" rel="noreferrer">
            Manage Subscription
          </a>
        )}
        {errMsg && <div className="error-msg">{errMsg}</div>}
      </div>
    );
  }
  // Active
  return (
    <div className="subscription-active">
      <h2>Subscription Active</h2>
      <p>Thank you for subscribing!</p>
      {portalUrl && (
        <a href={portalUrl} className="stripe-btn" target="_blank" rel="noreferrer">
          Manage or Update Subscription
        </a>
      )}
    </div>
  );
};

export default Subscription;
