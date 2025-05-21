// This script will be injected into the Claude webpage
console.log("Claude Branch Extension initialized");

// Add a floating button
function addFloatingButton() {
    // Remove any existing button first to avoid duplicates
    const existingButton = document.querySelector('#claude-branch-btn');
    if (existingButton) {
        existingButton.remove();
    }

    // Create the button element
    const button = document.createElement('button');
    button.id = 'claude-branch-btn';
    button.innerHTML = '🌿 Branch';
    button.title = 'Branch conversation to new tab';

    // Apply styling for a nice floating button
    button.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: #e18a6c;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
  `;

    // Add hover effects
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#c97c60';
        button.style.transform = 'scale(1.05)';
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#e18a6c';
        button.style.transform = 'scale(1)';
    });

    // Add active effect
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
    });

    button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
    });

    // Add click handler
    button.addEventListener('click', branchConversation);

    // Add to the page
    document.body.appendChild(button);
    console.log("Floating branch button added");
    
    // Add a status indicator that will show instead of an alert
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'claude-branch-status';
    statusIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 120px;
        background-color: #333;
        color: white;
        border-radius: 8px;
        padding: 8px 16px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
    `;
    document.body.appendChild(statusIndicator);
}

// Function to show status message instead of alert
function showStatus(message, duration = 3000) {
    const statusEl = document.querySelector('#claude-branch-status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.opacity = '1';
        
        setTimeout(() => {
            statusEl.style.opacity = '0';
        }, duration);
    }
}

// Function to extract conversation context
function extractConversationContext() {
    let conversationContext = "";

    // Get all visible text content from the page
    const allText = document.body.innerText;

    // Split by newlines and filter out UI elements
    const lines = allText.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 15 &&
            !trimmed.includes("Copy to clipboard") &&
            !trimmed.includes("Claude can make mistakes") &&
            !trimmed.includes("Reply to Claude") &&
            !trimmed.includes("Branch") &&
            !trimmed.includes("Retry");
    });

    // Build conversation context
    let currentSpeaker = "Claude"; // Assume starting with Claude's greeting
    let currentMessage = "";

    lines.forEach(line => {
        const trimmed = line.trim();

        // Skip very short lines or UI elements
        if (trimmed.length < 5 ||
            trimmed.includes("thumbs up") ||
            trimmed.includes("thumbs down")) {
            return;
        }

        // If line looks like a user message input area, it's probably the end
        if (trimmed.includes("Reply to Claude")) {
            return;
        }

        // Add line to current message
        currentMessage += trimmed + " ";

        // Every few lines, switch speakers and add to context
        if (currentMessage.length > 200) {
            conversationContext += currentSpeaker + ": " + currentMessage.trim() + "\n\n";
            currentMessage = "";
            currentSpeaker = currentSpeaker === "Claude" ? "Human" : "Claude";
        }
    });

    // Add any remaining message
    if (currentMessage.length > 0) {
        conversationContext += currentSpeaker + ": " + currentMessage.trim() + "\n\n";
    }

    return conversationContext;
}

// Function to branch the conversation into a new tab
function branchConversation() {
    console.log("Branch button clicked");

    // Extract the current conversation
    const conversationContext = extractConversationContext();

    if (conversationContext.length > 0) {
        console.log("Extracted conversation context");

        // Create the prompt for the new conversation
        const branchPrompt = `This conversation serves as a branch of a previous conversation. Here's the context of that conversation:\n\n${conversationContext}\n\nNow, let's continue from here:`;

        // Store the prompt in localStorage
        localStorage.setItem('claudeBranchPrompt', branchPrompt);
        
        // Show status message
        showStatus("Branching conversation to new tab...");

        // Open a new Claude tab with the correct URL
        // Use a short timeout to let the localStorage operation complete
        setTimeout(() => {
            const claudeUrl = "https://claude.ai/new";
            window.open(claudeUrl, '_blank');
        }, 100);
    } else {
        console.log("Could not extract conversation context");
        showStatus("Could not extract conversation context", 3000);
    }
}

// For new chat pages, check if we should load a branch prompt
function checkForBranchPrompt() {
    if (window.location.href.includes('/new')) {
        console.log("Detected new chat page, checking for branch prompt");

        // Try to get the stored prompt
        const branchPrompt = localStorage.getItem('claudeBranchPrompt');

        if (branchPrompt) {
            console.log("Found stored branch prompt");
            
            // Add a visual indicator that we're loading the prompt
            const loadingIndicator = document.createElement('div');
            loadingIndicator.textContent = "Loading branched conversation...";
            loadingIndicator.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background-color: #333;
                color: white;
                border-radius: 4px;
                padding: 8px 12px;
                font-size: 14px;
                z-index: 10000;
            `;
            document.body.appendChild(loadingIndicator);

            // Function to insert the prompt into the textarea
            function insertPrompt() {
                const textarea = document.querySelector('textarea, [role="textbox"], [contenteditable="true"]');

                if (textarea) {
                    // For contenteditable elements
                    if (textarea.getAttribute('contenteditable') === 'true') {
                        textarea.innerHTML = branchPrompt;
                    } else {
                        // For regular textareas
                        textarea.value = branchPrompt;
                    }

                    // Try to trigger input events to update UI
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));

                    // Clear the stored prompt to avoid reusing it
                    localStorage.removeItem('claudeBranchPrompt');

                    // Scroll to the end of the textarea
                    textarea.scrollTop = textarea.scrollHeight;

                    // Try to focus the textarea
                    textarea.focus();

                    // Remove the loading indicator
                    loadingIndicator.remove();
                    
                    console.log("Inserted branch prompt into new chat");
                    return true;
                }

                return false;
            }

            // Try to insert the prompt with increasing delays
            if (!insertPrompt()) {
                setTimeout(() => {
                    if (!insertPrompt()) {
                        setTimeout(() => {
                            if (!insertPrompt()) {
                                setTimeout(insertPrompt, 1000);
                            }
                        }, 500);
                    }
                }, 200);
            }
        }
    }
}

// Initialize our extension
function initialize() {
    // Add the floating button on conversation pages
    if (!window.location.href.includes('/new')) {
        addFloatingButton();

        // Keep checking to ensure button stays on page
        setInterval(addFloatingButton, 3000);
    }

    // Check if this is a new chat page that should receive a branch prompt
    checkForBranchPrompt();
}

// Run our initialization when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Also run when window is fully loaded
window.addEventListener('load', initialize);

// Run now to ensure we don't miss anything
setTimeout(initialize, 1000);