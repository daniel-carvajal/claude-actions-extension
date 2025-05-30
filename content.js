// This script will be injected into the Claude webpage
console.log("Claude Branch Extension initialized");

let menuVisible = false;

let xOffset = 60

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
    button.innerHTML = '🌿';
    button.title = 'Branch conversation options';

    // Apply styling for a nice floating button
    button.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: ${20 + xOffset}px;
    background-color: #e18a6c;
    color: white;
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  `;

    // Add hover effects
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#c97c60';
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    });

    button.addEventListener('mouseout', () => {
        if (!menuVisible) {
            button.style.backgroundColor = '#e18a6c';
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }
    });

    // Add click handler to toggle menu
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBranchMenu();
    });

    // Add to the page
    document.body.appendChild(button);
    console.log("Floating branch button added");
    
    // Add a status indicator that will show instead of an alert
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'claude-branch-status';
    statusIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: ${80 + xOffset}px;
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

// Create the fan menu
function createBranchMenu() {
    // Remove existing menu if it exists
    const existingMenu = document.querySelector('#claude-branch-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    const menuContainer = document.createElement('div');
    menuContainer.id = 'claude-branch-menu';
    menuContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: ${20 + xOffset}px;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Menu options with their positions in a semi-circle
    const menuOptions = [
        { 
            icon: '🌿', 
            label: 'Branch Current', 
            action: () => branchConversation(),
            angle: 45 
        },
        { 
            icon: '✂️', 
            label: 'Branch from Here', 
            action: () => branchFromSelection(),
            angle: 90 
        },
        { 
            icon: '🔄', 
            label: 'Branch & Reset', 
            action: () => branchAndReset(),
            angle: 135 
        },
        { 
            icon: '💾', 
            label: 'Save Branch', 
            action: () => saveBranch(),
            angle: 180 
        }
    ];

    const radius = 80;

    menuOptions.forEach((option, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'branch-menu-item';

        // Calculate position using polar coordinates
        const angleRad = (option.angle * Math.PI) / 180;
        const x = -Math.cos(angleRad) * radius;
        const y = -Math.sin(angleRad) * radius; // Negative because CSS y increases downward
        
        menuItem.style.cssText = `
            position: absolute;
            bottom: 24px;
            left: 24px;
            width: 44px;
            height: 44px;
            background-color: #2d2d2d;
            border: 2px solid #e18a6c;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            color: white;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            transform: translate(${x}px, ${y}px) scale(0);
            pointer-events: auto;
            user-select: none;
        `;
        
        menuItem.innerHTML = option.icon;
        menuItem.title = option.label;
        
        // Add hover effects
        menuItem.addEventListener('mouseover', () => {
            menuItem.style.backgroundColor = '#3d3d3d';
            menuItem.style.transform = `translate(${x}px, ${y}px) scale(1.15)`;
            menuItem.style.borderColor = '#c97c60';
            
            // Show tooltip
            showTooltip(menuItem, option.label);
        });
        
        menuItem.addEventListener('mouseout', () => {
            menuItem.style.backgroundColor = '#2d2d2d';
            menuItem.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            menuItem.style.borderColor = '#e18a6c';
            
            // Hide tooltip
            hideTooltip();
        });
        
        // Add click handler
        menuItem.addEventListener('click', (e) => {
            e.stopPropagation();
            option.action();
            hideBranchMenu();
        });
        
        menuContainer.appendChild(menuItem);
        
        // Animate in with staggered delay
        setTimeout(() => {
            menuItem.style.transform = `translate(${x}px, ${y}px) scale(1)`;
        }, index * 50);
    });

    document.body.appendChild(menuContainer);
    
    // Show the menu container
    setTimeout(() => {
        menuContainer.style.opacity = '1';
    }, 10);

    return menuContainer;
}

// Show tooltip for menu items
function showTooltip(element, text) {
    hideTooltip(); // Remove any existing tooltip
    
    const tooltip = document.createElement('div');
    tooltip.id = 'branch-menu-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: fixed;
        background-color: #1a1a1a;
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 10001;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip near the element
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.right + 10}px`;
    tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2)}px`;
    
    // Show tooltip
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 100);
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.querySelector('#branch-menu-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Toggle the branch menu
function toggleBranchMenu() {
    if (menuVisible) {
        hideBranchMenu();
    } else {
        showBranchMenu();
    }
}

// Show the branch menu
function showBranchMenu() {
    createBranchMenu();
    menuVisible = true;
    
    // Update button appearance
    const button = document.querySelector('#claude-branch-btn');
    if (button) {
        button.style.backgroundColor = '#c97c60';
        button.style.transform = 'scale(1.1) rotate(45deg)';
        button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    }
}

// Hide the branch menu
function hideBranchMenu() {
    const menu = document.querySelector('#claude-branch-menu');
    if (menu) {
        menu.style.opacity = '0';
        setTimeout(() => {
            menu.remove();
        }, 300);
    }
    
    hideTooltip();
    menuVisible = false;
    
    // Reset button appearance
    const button = document.querySelector('#claude-branch-btn');
    if (button) {
        button.style.backgroundColor = '#e18a6c';
        button.style.transform = 'scale(1) rotate(0deg)';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (menuVisible && !e.target.closest('#claude-branch-btn') && !e.target.closest('#claude-branch-menu')) {
        hideBranchMenu();
    }
});

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

// Original branch function - branches entire conversation
function branchConversation() {
    console.log("Branch Current clicked");

    const conversationContext = extractConversationContext();

    if (conversationContext.length > 0) {
        console.log("Extracted conversation context");

        const branchPrompt = `This conversation serves as a branch of a previous conversation. Here's the context of that conversation:\n\n${conversationContext}\n\nNow, let's continue from here:`;

        localStorage.setItem('claudeBranchPrompt', branchPrompt);
        showStatus("Branching entire conversation...");

        setTimeout(() => {
            const claudeUrl = "https://claude.ai/new";
            window.open(claudeUrl, '_blank');
        }, 100);
    } else {
        console.log("Could not extract conversation context");
        showStatus("Could not extract conversation context", 3000);
    }
}

// Branch from current selection or cursor position
function branchFromSelection() {
    console.log("Branch from Here clicked");
    showStatus("Branch from selection - Feature coming soon!", 2000);
    // TODO: Implement selection-based branching
}

// Branch and reset the current conversation
function branchAndReset() {
    console.log("Branch & Reset clicked");
    showStatus("Branch & Reset - Feature coming soon!", 2000);
    // TODO: Implement branch and reset functionality
}

// Save current branch state
function saveBranch() {
    console.log("Save Branch clicked");
    showStatus("Save Branch - Feature coming soon!", 2000);
    // TODO: Implement branch saving functionality
}

// For new chat pages, check if we should load a branch prompt
function checkForBranchPrompt() {
    if (window.location.href.includes('/new')) {
        console.log("Detected new chat page, checking for branch prompt");

        const branchPrompt = localStorage.getItem('claudeBranchPrompt');

        if (branchPrompt) {
            console.log("Found stored branch prompt");
            
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

            function insertPrompt() {
                const textarea = document.querySelector('textarea, [role="textbox"], [contenteditable="true"]');

                if (textarea) {
                    if (textarea.getAttribute('contenteditable') === 'true') {
                        textarea.innerHTML = branchPrompt;
                    } else {
                        textarea.value = branchPrompt;
                    }

                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));

                    localStorage.removeItem('claudeBranchPrompt');
                    textarea.scrollTop = textarea.scrollHeight;
                    textarea.focus();
                    loadingIndicator.remove();
                    
                    console.log("Inserted branch prompt into new chat");
                    return true;
                }

                return false;
            }

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
        setInterval(addFloatingButton, 3000);
    }

    checkForBranchPrompt();
}

// Run our initialization when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

window.addEventListener('load', initialize);
setTimeout(initialize, 1000);