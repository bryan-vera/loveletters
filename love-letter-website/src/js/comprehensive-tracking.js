// Enhanced tracking functions to add to your existing tracking
// Add these to your main JavaScript to track every interaction

function setupComprehensiveTracking() {
    // Track all button clicks (including continue buttons)
    document.addEventListener('click', (e) => {
        const isButton = e.target.tagName === 'BUTTON' || e.target.type === 'button' || e.target.classList.contains('btn');
        
        trackEvent('click', {
            x: e.clientX,
            y: e.clientY,
            target: e.target.tagName,
            target_id: e.target.id,
            target_class: e.target.className,
            is_button: isButton,
            button_text: isButton ? e.target.textContent.trim() : null,
            data_attributes: Array.from(e.target.attributes)
                .filter(attr => attr.name.startsWith('data-'))
                .map(attr => ({ name: attr.name, value: attr.value }))
        });

        // Special tracking for specific buttons
        if (isButton) {
            const buttonText = e.target.textContent.trim().toLowerCase();
            const buttonId = e.target.id;
            
            // Track continue/navigation buttons
            if (buttonText.includes('continue') || 
                buttonText.includes('next') || 
                buttonText.includes('unlock') ||
                buttonId.includes('continue') ||
                buttonId.includes('submit') ||
                buttonId.includes('gallery') ||
                buttonId.includes('reply')) {
                
                trackEvent('continue_button_click', {
                    button_id: buttonId,
                    button_text: e.target.textContent.trim(),
                    button_class: e.target.className,
                    x: e.clientX,
                    y: e.clientY
                });
            }
        }
    });

    // Track all scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            trackEvent('scroll', {
                scroll_position: window.scrollY,
                scroll_percent: Math.round(scrollPercent)
            });
        }, 100);
    });

    // Track zoom changes
    let lastZoom = window.devicePixelRatio;
    setInterval(() => {
        const currentZoom = window.devicePixelRatio;
        if (currentZoom !== lastZoom) {
            trackEvent('zoom_change', {
                previous_zoom: lastZoom,
                zoom_level: currentZoom
            });
            lastZoom = currentZoom;
        }
    }, 500);

    // Track viewport changes
    window.addEventListener('resize', () => {
        trackEvent('viewport_change', {
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight
        });
    });

    // Track all textboxes (textarea and input elements)
    function setupTextboxTracking() {
        const textElements = document.querySelectorAll('textarea, input[type="text"], input[type="email"], input[type="search"], #q3-input');
        
        textElements.forEach((element) => {
            // Skip if already has tracking listeners
            if (element.hasAttribute('data-tracking-enabled')) return;
            element.setAttribute('data-tracking-enabled', 'true');
            
            let lastContent = '';
            let keystrokes = 0;
            
            console.log('Setting up tracking for:', element.id || element.tagName); // Debug log
            
            // Track input changes
            element.addEventListener('input', (e) => {
                keystrokes++;
                const content = e.target.value;
                const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
                
                trackEvent('textbox_input', {
                    element_id: e.target.id || 'unnamed',
                    element_type: e.target.tagName.toLowerCase(),
                    content_length: content.length,
                    current_value: content,  // Send the actual content
                    word_count: wordCount,
                    action: content.length > lastContent.length ? 'typing' : 'deleting',
                    keystrokes: keystrokes,
                    placeholder: e.target.placeholder || ''
                });
                
                lastContent = content;
            });

            // Track keyup events for all keys
            element.addEventListener('keyup', (e) => {
                console.log('Keyup detected:', e.key, 'on element:', e.target.id); // Debug log
                trackEvent('textbox_keyup', {
                    element_id: e.target.id || 'unnamed',
                    element_type: e.target.tagName.toLowerCase(),
                    key: e.key,
                    key_code: e.keyCode,
                    ctrl_key: e.ctrlKey,
                    alt_key: e.altKey,
                    shift_key: e.shiftKey,
                    content_length: e.target.value.length,
                    cursor_position: e.target.selectionStart,
                    current_value: e.target.value
                });
            });

            // Track keydown for immediate feedback
            element.addEventListener('keydown', (e) => {
                trackEvent('textbox_keydown', {
                    element_id: e.target.id || 'unnamed',
                    element_type: e.target.tagName.toLowerCase(),
                    key: e.key,
                    key_code: e.keyCode,
                    ctrl_key: e.ctrlKey,
                    alt_key: e.altKey,
                    shift_key: e.shiftKey,
                    content_length: e.target.value.length,
                    current_value: e.target.value  // Send actual content
                });
                
                // Special tracking for Enter and Escape
                if (e.key === 'Enter' || e.key === 'Escape') {
                    trackEvent('special_key_press', {
                        element_id: e.target.id || 'unnamed',
                        element_type: e.target.tagName.toLowerCase(),
                        key: e.key,
                        content_length: e.target.value.length,
                        content_preview: e.target.value.substring(0, 50),
                        ctrl_key: e.ctrlKey,
                        alt_key: e.altKey,
                        shift_key: e.shiftKey
                    });
                }
            });

            // Track copy/paste
            element.addEventListener('paste', (e) => {
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                trackEvent('paste', {
                    element_id: e.target.id || 'unnamed',
                    element_type: e.target.tagName.toLowerCase(),
                    pasted_length: pastedText.length,
                    pasted_content: pastedText.substring(0, 100) // First 100 chars only
                });
            });

            element.addEventListener('copy', (e) => {
                const selectedText = window.getSelection().toString();
                trackEvent('copy', {
                    element_id: e.target.id || 'unnamed',
                    element_type: e.target.tagName.toLowerCase(),
                    copied_length: selectedText.length
                });
            });

            // Track focus and blur
            element.addEventListener('focus', (e) => {
                trackEvent('textbox_focus', {
                    element_id: e.target.id || 'unnamed',
                    element_type: e.target.tagName.toLowerCase(),
                    content_length: e.target.value.length
                });
            });

            element.addEventListener('blur', (e) => {
                trackEvent('textbox_blur', {
                    element_id: e.target.id || 'unnamed',
                    element_type: e.target.tagName.toLowerCase(),
                    content_length: e.target.value.length,
                    final_content_preview: e.target.value.substring(0, 100)
                });
            });
        });
        
        console.log('Textbox tracking setup complete. Found elements:', textElements.length); // Debug log
    }

    // Initial setup and re-setup when new elements are added
    setupTextboxTracking();
    
    // More aggressive re-checking for dynamic content
    const observer = new MutationObserver(() => {
        setTimeout(setupTextboxTracking, 100); // Small delay to ensure elements are rendered
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Also re-run after a delay to catch any delayed content
    setTimeout(setupTextboxTracking, 1000);
    setTimeout(setupTextboxTracking, 3000);

    // Global fallback keyup listener for ALL elements
    document.addEventListener('keyup', (e) => {
        if (e.target.matches('textarea, input[type="text"], input[type="email"], input[type="search"], #q3-input')) {
            console.log('Global keyup fallback triggered for:', e.target.id || e.target.tagName, 'Key:', e.key);
            trackEvent('global_keyup_fallback', {
                element_id: e.target.id || 'unnamed',
                element_type: e.target.tagName.toLowerCase(),
                key: e.key,
                key_code: e.keyCode,
                content_length: e.target.value.length,
                current_value: e.target.value,
                timestamp: Date.now()
            });
        }
    }, true); // Use capture phase to ensure we catch it

    // Expose function to manually setup tracking for specific elements
    window.setupElementTracking = function(elementId) {
        setTimeout(() => {
            console.log('Manual setup for element:', elementId);
            setupTextboxTracking();
        }, 100);
    };

    // Track time on page
    let pageStartTime = Date.now();
    let lastActivityTime = Date.now();

    // Update activity time on any interaction
    ['click', 'keydown', 'mousemove', 'scroll'].forEach(eventType => {
        document.addEventListener(eventType, () => {
            lastActivityTime = Date.now();
        }, true);
    });

    // Send time tracking every 30 seconds
    setInterval(() => {
        const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);
        trackEvent('time_tracking', {
            time_on_page: timeOnPage,
            last_activity_seconds_ago: Math.round((Date.now() - lastActivityTime) / 1000)
        });
    }, 30000);

    // Track when user leaves page
    window.addEventListener('beforeunload', () => {
        const totalTime = Math.round((Date.now() - pageStartTime) / 1000);
        trackEvent('page_exit', {
            total_time_on_page: totalTime
        });
    });
}

// Call this function after DOM loads
document.addEventListener('DOMContentLoaded', setupComprehensiveTracking);