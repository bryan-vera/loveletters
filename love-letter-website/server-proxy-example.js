// Server-side proxy approach (requires backend)
// Instead of calling Supabase directly, call your own API endpoint
// Your server makes the Supabase calls with the real credentials

async function trackEvent(eventName, payload) {
    try {
        await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventName, payload, sessionId: window.supabaseSessionId })
        });
    } catch (error) {
        console.warn('Tracking failed:', error);
    }
}

// Your backend endpoint would then call Supabase with server-side credentials