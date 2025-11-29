import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';

// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

// Decode JWT to get user info
function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

export const GoogleSignInButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { authenticateWithGoogle } = useAuthStore();

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && buttonRef.current) {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          // IMPORTANT: Replace this with your actual Google OAuth Client ID
          // Get it from: https://console.cloud.google.com/
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
          callback: async (response) => {
            try {
              // Send Google token to backend for verification and JWT exchange
              await authenticateWithGoogle(response.credential);
              console.log('User authenticated successfully');
            } catch (error) {
              console.error('Failed to authenticate:', error);
              alert('Authentication failed. Please try again.');
            }
          },
        });

        // Render the sign-in button
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
        });
      }
    };

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, [authenticateWithGoogle]);

  return <div ref={buttonRef}></div>;
};
