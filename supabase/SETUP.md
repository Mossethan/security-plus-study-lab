# Activate account sync

Production site: `https://mossethan.github.io/security-plus-study-lab/`

## 1. Supabase Free project

Create a project named `security-plus-study-lab` in a Free organization. Do not enable a paid plan or add-ons. Apply `migrations/202610150001_study_sync.sql` once using the SQL editor or the connected Supabase migration tool.

In Authentication → URL Configuration set:

- Site URL: `https://mossethan.github.io/security-plus-study-lab/`
- Allowed redirect: `https://mossethan.github.io/security-plus-study-lab/account.html`

Copy the project URL and **publishable** key into `sync-config.js`. The legacy `anon` public key also works. Never use a `service_role` or secret key. All database writes go through an authenticated function; it derives user identity from the session, never from a client-supplied owner ID.

## 2. Google sign-in

Follow [Supabase's Google OAuth instructions](https://supabase.com/docs/guides/auth/social-login/auth-google).

Create a Google Cloud project for the study website and a Web application OAuth client. Set the authorized JavaScript origin to `https://mossethan.github.io`. Set the redirect URI to `https://PROJECT_REF.supabase.co/auth/v1/callback`, using the callback shown in Supabase's Google provider settings.

Use only `openid`, email and profile scopes. Configure an external audience. In testing mode, explicitly add each intended Google test account. For normal public sign-in, publish the OAuth application as appropriate for Google's basic sign-in requirements.

Enter the Google client ID and secret **only in Supabase Authentication → Sign In / Providers → Google**, and enable Google. The Google client secret must never be committed to GitHub or pasted into chat. No Gmail or Drive permissions are needed.

## 3. Live checks before declaring activation complete

1. Sign in on the desktop with a real Google account. Import previous browser progress from Account & sync. Verify a private row is created under that account's UUID.
2. Sign in on another browser/device with the same account. Confirm notes, answers, weak spots and attempts load; edit a different item on each device and verify both survive.
3. Disconnect a device, make a change, reconnect, and verify the sync status returns to Synced.
4. Edit the same note on two devices and verify the conflict chooser appears; confirm both versions can be backed up.
5. Sign in as a second user. Confirm it cannot select the first user's row and cannot write or delete arbitrary rows. Verify unauthenticated requests cannot read or save progress.
6. Export/import a JSON backup and confirm it contains only study data, with no auth tokens.

The free database may pause after a week without activity. Resume it from the Supabase dashboard; local studying and exports remain available. Free projects have no automatic database backup, so keep progress exports.
