// If you add a build process (Vite, Webpack, etc.), you can use environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create .env file in root:
// VITE_SUPABASE_URL=your-url-here
// VITE_SUPABASE_ANON_KEY=your-key-here