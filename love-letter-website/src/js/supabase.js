(function () {
    const config = window.SUPABASE_CONFIG || {};
    const SUPABASE_URL = config.url || '';
    const SUPABASE_ANON_KEY = config.anonKey || '';

    let supabaseClient = null;
    if (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    const sessionKey = 'love_letter_session_id';
    let sessionId = localStorage.getItem(sessionKey);
    if (!sessionId) {
        const uuid = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        sessionId = uuid;
        localStorage.setItem(sessionKey, sessionId);
    }

    async function safeInsert(table, payload) {
        if (!supabaseClient) return;
        try {
            await supabaseClient.from(table).insert([payload]);
        } catch (error) {
            console.warn('Supabase insert failed:', error);
        }
    }

    async function trackTriviaAttempt(questionNum, attempt, answer, isCorrect) {
        await safeInsert('trivia_attempts', {
            session_id: sessionId,
            question_number: questionNum,
            attempt_number: attempt,
            answer_given: answer,
            is_correct: isCorrect
        });
    }

    async function trackTriviaCompletion(data) {
        await safeInsert('trivia_completions', {
            session_id: sessionId,
            q1_attempts: data.q1_attempts,
            q2_attempts: data.q2_attempts,
            q3_attempts: data.q3_attempts,
            q3_guesses: data.q3_guesses,
            total_time_seconds: data.total_time_seconds
        });
    }

    async function trackReply(replyContent) {
        const wordCount = replyContent.trim().split(/\s+/).filter(word => word.length > 0).length;
        await safeInsert('replies', {
            session_id: sessionId,
            reply_content: replyContent,
            reply_length: replyContent.length,
            reply_word_count: wordCount
        });
    }

    async function trackEvent(eventType, eventData = {}) {
        // Build the event record to match your existing schema
        const eventRecord = {
            session_id: sessionId,
            event_type: eventType,
            page_url: window.location.href,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
        };

        // Map common event data to your schema columns
        if (eventData.content_length !== undefined) eventRecord.current_length = eventData.content_length;
        if (eventData.action) eventRecord.action = eventData.action;
        if (eventData.scroll_percent !== undefined) eventRecord.scroll_percent = eventData.scroll_percent;
        if (eventData.scroll_position !== undefined) eventRecord.scroll_position = eventData.scroll_position;
        if (eventData.zoom_level !== undefined) eventRecord.zoom_level = eventData.zoom_level;
        if (eventData.previous_zoom !== undefined) eventRecord.previous_zoom = eventData.previous_zoom;
        if (eventData.x !== undefined) eventRecord.x = eventData.x;
        if (eventData.y !== undefined) eventRecord.y = eventData.y;
        if (eventData.copied_length !== undefined) eventRecord.copied_length = eventData.copied_length;
        if (eventData.pasted_length !== undefined) eventRecord.pasted_length = eventData.pasted_length;
        if (eventData.reply_length !== undefined) eventRecord.reply_length = eventData.reply_length;
        if (eventData.reply_word_count !== undefined) eventRecord.reply_word_count = eventData.reply_word_count;
        if (eventData.time_on_page !== undefined) eventRecord.time_on_page = eventData.time_on_page;
        if (eventData.total_time_on_page !== undefined) eventRecord.total_time_on_page = eventData.total_time_on_page;

        // Store the typed content directly in the content field if available
        if (eventData.current_value !== undefined) {
            eventRecord.content = eventData.current_value;
        } else if (Object.keys(eventData).length > 0) {
            // Store additional data as JSON in content field if no current_value
            eventRecord.content = JSON.stringify(eventData);
        }

        await safeInsert('events', eventRecord);
    }

    window.supabaseClient = supabaseClient;
    window.supabaseSessionId = sessionId;
    window.trackTriviaAttempt = trackTriviaAttempt;
    window.trackTriviaCompletion = trackTriviaCompletion;
    window.trackReply = trackReply;
    window.trackEvent = trackEvent;
})();
