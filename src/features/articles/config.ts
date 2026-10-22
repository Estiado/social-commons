// Local pilot is the default. Cloud sign-in is enabled only after SMTP and
// real account-isolation/synchronization acceptance have been completed.
export const READING_CLOUD_ENABLED = import.meta.env.VITE_READING_CLOUD_ENABLED === 'true';
