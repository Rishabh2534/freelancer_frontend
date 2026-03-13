// Auth is handled by the backend API (see services/api.ts). This stub ensures
// no Supabase URL is ever called. Use the Login and Register pages instead.
const notSupported = () =>
  Promise.reject(
    new Error(
      'Auth is handled by the backend API. Use the Register or Login page.'
    )
  );

export const supabase = {
  auth: {
    signUp: notSupported,
    signInWithPassword: notSupported,
    signOut: notSupported,
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
} as any;
