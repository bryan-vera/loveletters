(function () {
    const state = {
        startedAt: null,
        q1: { attempts: 0, correct: false },
        q2: { attempts: 0, correct: false },
        q3: { attempts: 0, correct: false },
        q3Guesses: []
    };

    function $(id) {
        return document.getElementById(id);
    }

    function setFeedback(id, message, type) {
        const el = $(id);
        if (!el) return;
        el.textContent = message;
        el.classList.remove('error', 'success');
        if (type) el.classList.add(type);
    }

    function showQuestion(number) {
        const questions = document.querySelectorAll('.trivia-question');
        questions.forEach((q) => q.classList.remove('active'));
        const current = document.querySelector(`.trivia-question[data-question="${number}"]`);
        if (current) current.classList.add('active');
        const stepEl = $('trivia-step');
        if (stepEl) stepEl.textContent = String(number);
    }

    function shake(element) {
        if (!element) return;
        element.classList.add('trivia-shake');
        setTimeout(() => element.classList.remove('trivia-shake'), 450);
    }

    function handleQ1Click(event) {
        const btn = event.currentTarget;
        if (state.q1.correct) return;
        state.q1.attempts += 1;
        const answer = btn.dataset.answer || btn.textContent.trim();
        const isCorrect = btn.dataset.correct === 'true';

        window.trackTriviaAttempt?.(1, state.q1.attempts, answer, isCorrect);
        window.trackEvent?.('trivia_q1_attempt', {
            answer,
            attempt_number: state.q1.attempts,
            is_correct: isCorrect
        });

        if (isCorrect) {
            state.q1.correct = true;
            setFeedback('q1-feedback', 'Correcto! Vamos a la siguiente', 'success');
            setTimeout(() => showQuestion(2), 500);
        } else {
            setFeedback('q1-feedback', 'Umm no, quizás te falla la memoria, pero intentalo nuevamente.', 'error');
            shake(btn);
        }
    }

    function handleQ2Click(event) {
        const btn = event.currentTarget;
        if (state.q2.correct) return;
        state.q2.attempts += 1;
        const answer = btn.dataset.answer || btn.textContent.trim();
        const isCorrect = btn.dataset.correct === 'true';

        window.trackTriviaAttempt?.(2, state.q2.attempts, answer, isCorrect);
        window.trackEvent?.('trivia_q2_attempt', {
            answer,
            attempt_number: state.q2.attempts,
            is_correct: isCorrect
        });

        if (isCorrect) {
            state.q2.correct = true;
            setFeedback('q2-feedback', 'Respuesta correcta, lets go!!', 'success');
            setTimeout(() => showQuestion(3), 500);
        } else {
            setFeedback('q2-feedback', 'Not quite my tempo', 'error');
            shake(btn);
        }
    }

    function handleQ3Submit() {
        if (state.q3.correct) return;
        const input = $('q3-input');
        const guessRaw = input ? input.value.trim() : '';
        const guess = guessRaw;
        state.q3.attempts += 1;
        state.q3Guesses.push(guessRaw);

        const isCorrect = guessRaw.toLowerCase() === 'espeon';

        window.trackTriviaAttempt?.(3, state.q3.attempts, guessRaw, isCorrect);
        window.trackEvent?.('trivia_q3_attempt', {
            answer: guessRaw,
            attempt_number: state.q3.attempts,
            is_correct: isCorrect
        });

        if (isCorrect) {
            state.q3.correct = true;
            setFeedback('q3-feedback', 'Perfecto! La carta ha sido desbloqueada...', 'success');
            completeTrivia();
        } else {
            setFeedback('q3-feedback', 'Umm no es el correcto, recuerda que le preguntaste a ChatGPT haha', 'error');
            shake(input);
            if (input) input.focus();
        }
    }

    function completeTrivia() {
        const totalAttempts = state.q1.attempts + state.q2.attempts + state.q3.attempts;
        const totalTimeSeconds = state.startedAt ? Math.round((Date.now() - state.startedAt) / 1000) : null;

        window.trackTriviaCompletion?.({
            q1_attempts: state.q1.attempts,
            q2_attempts: state.q2.attempts,
            q3_attempts: state.q3.attempts,
            q3_guesses: state.q3Guesses,
            total_time_seconds: totalTimeSeconds
        });

        window.trackEvent?.('trivia_completed', {
            total_attempts: totalAttempts,
            q1_attempts: state.q1.attempts,
            q2_attempts: state.q2.attempts,
            q3_attempts: state.q3.attempts,
            q3_guesses: state.q3Guesses,
            total_time_seconds: totalTimeSeconds
        });

        // Show completion options instead of auto-starting letter
        showTriviaCompletion();
    }

    function initTrivia() {
        const q1Buttons = document.querySelectorAll('.trivia-q1 .trivia-option');
        q1Buttons.forEach((btn) => btn.addEventListener('click', handleQ1Click));

        const q2Buttons = document.querySelectorAll('.trivia-q2 .trivia-option');
        q2Buttons.forEach((btn) => btn.addEventListener('click', handleQ2Click));

        const q3Submit = $('q3-submit');
        if (q3Submit) q3Submit.addEventListener('click', handleQ3Submit);

        const q3Input = $('q3-input');
        if (q3Input) {
            // Ensure comprehensive tracking is setup for this element
            window.setupElementTracking?.('q3-input');
            
            q3Input.addEventListener('input', (event) => {
                window.trackEvent?.('trivia_q3_typing', { 
                    current_value: event.target.value,
                    content_length: event.target.value.length,
                    element_id: event.target.id
                });
            });
            q3Input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    window.trackEvent?.('trivia_q3_enter_key', {
                        current_value: event.target.value,
                        content_length: event.target.value.length
                    });
                    handleQ3Submit();
                }
                if (event.key === 'Escape') {
                    window.trackEvent?.('trivia_q3_escape_key', {
                        current_value: event.target.value,
                        content_length: event.target.value.length
                    });
                }
            });
            q3Input.addEventListener('keyup', (event) => {
                window.trackEvent?.('trivia_q3_keyup', {
                    key: event.key,
                    current_value: event.target.value,
                    content_length: event.target.value.length,
                    cursor_position: event.target.selectionStart
                });
            });
        }
    }

    window.startTrivia = function startTrivia() {
        const triviaScene = $('trivia-scene');
        if (!triviaScene) return;
        triviaScene.classList.add('visible');
        state.startedAt = Date.now();
        showQuestion(1);
        window.trackEvent?.('trivia_started', { timestamp: new Date().toISOString() });
    };

    // Show trivia completion options
    function showTriviaCompletion() {
        const completionSection = $('trivia-completion');
        if (completionSection) {
            completionSection.classList.add('visible');
        }
    }

    // Skip directly to reply section
    function skipToReply() {
        window.trackEvent?.('trivia_skip_to_reply', {
            skipped_letter: true,
            skipped_gallery: true,
            timestamp: new Date().toISOString()
        });

        const triviaScene = $('trivia-scene');
        if (triviaScene) triviaScene.classList.remove('visible');

        // Show Spotify popup for reply directly
        setTimeout(() => {
            document.getElementById('spotify-reply').classList.add('visible');
            
            if (window.trackEvent) {
                window.trackEvent('spotify_popup_shown', {
                    popup_type: 'reply',
                    song_name: 'Damien Rice',
                    stage: 'before_reply_skip'
                });
            }
        }, 300);
    }

    // Read the complete letter
    function readCompleteLetter() {
        window.trackEvent?.('trivia_chose_complete_letter', {
            timestamp: new Date().toISOString()
        });

        const triviaScene = $('trivia-scene');
        if (triviaScene) triviaScene.classList.remove('visible');
        
        setTimeout(() => {
            window.startLetterFlow?.();
        }, 300);
    }

    document.addEventListener('DOMContentLoaded', initTrivia);

    // Add event listeners for completion buttons
    document.addEventListener('DOMContentLoaded', () => {
        const btnReadLetter = $('btn-read-letter');
        const btnSkipToReply = $('btn-skip-to-reply');

        if (btnReadLetter) {
            btnReadLetter.addEventListener('click', readCompleteLetter);
        }

        if (btnSkipToReply) {
            btnSkipToReply.addEventListener('click', skipToReply);
        }
    });
})();
