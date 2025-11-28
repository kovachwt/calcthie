# Google OAuth Setup Guide

This guide explains how to set up Google Sign-In for the Calcthie app.

## Quick Overview

The app uses Google Identity Services for authentication. Users can optionally sign in with their Google account to get a unique user ID. Currently, the app **continues to use local storage** whether logged in or not - cloud sync will be added later.

## What You Need

1. A Google Cloud Project
2. OAuth 2.0 Client ID
3. `.env` file with your Client ID

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Calcthie" (or whatever you prefer)
4. Click "Create"

### 2. Enable Google Identity Services

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Identity"
3. Click "Google Identity Toolkit API"
4. Click "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: **Calcthie**
   - User support email: *your email*
   - Developer contact: *your email*
   - Scopes: None needed (we request minimal permissions)
   - Test users: Add your email
   - Click "Save and Continue"

4. Back at "Create OAuth client ID":
   - Application type: **Web application**
   - Name: **Calcthie Web Client**
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Add your production domain later
   - Authorized redirect URIs: *Leave empty (not needed for Google Identity Services)*
   - Click "Create"

5. **Copy the Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)

### 4. Configure Your App

1. In the `calcthie-frontend` folder, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
   ```

3. Restart the dev server:
   ```bash
   npm run dev
   ```

### 5. Test It Out

1. Open http://localhost:5173
2. You should see a "Sign in with Google" button in the header
3. Click it and sign in with your Google account
4. Your name, email, and user ID will be displayed
5. Click "Sign Out" to log out

## What Data We Request

**Minimal permissions only:**
- `sub` (user ID) - Google's unique identifier for the user
- `email` - User's email address
- `name` - User's display name
- `picture` - User's profile picture URL

**We do NOT request:**
- Access to Google Drive
- Access to Gmail
- Access to Calendar
- Any other Google services

## Current Behavior

- **Logged Out:** App works normally with local storage
- **Logged In:** App still uses local storage (cloud sync coming later)
- User ID is logged to console for debugging
- No data is sent to any server yet

## Troubleshooting

### "Invalid Client ID" Error
- Make sure your `.env` file exists and has the correct Client ID
- Restart the dev server after creating/editing `.env`
- Check that the Client ID ends with `.apps.googleusercontent.com`

### Sign-In Button Doesn't Appear
- Check browser console for errors
- Make sure Google's script loaded: look for `accounts.google.com/gsi/client` in Network tab
- Try hard refresh (Ctrl+Shift+R)

### "Redirect URI mismatch" Error
- Make sure `http://localhost:5173` is in "Authorized JavaScript origins"
- Don't add it to "Authorized redirect URIs" (different thing)

### OAuth Consent Screen Warnings
- In development, you may see "This app isn't verified" - this is normal
- Click "Advanced" → "Go to Calcthie (unsafe)" to proceed
- In production, you'll need to verify your app with Google

## Next Steps (Future Work)

1. ✅ Get Google user ID
2. ⏳ Create backend API for user data storage
3. ⏳ Sync meals/favorites/goals to cloud
4. ⏳ Multi-device sync
5. ⏳ Shared meals with other users

## Security Notes

- Client ID is **not a secret** - it's safe to commit to git
- Never commit OAuth Client Secret (we don't use one for frontend-only auth)
- Use HTTPS in production
- Implement CSRF protection when adding backend
