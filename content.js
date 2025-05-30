// This script will be injected into the Claude webpage
console.log("Claude Branch Extension initialized");

let menuVisible = false;
let xOffset = 60;

// ===== CENTRALIZED MENU CONFIGURATION =====
const MENU_ACTIONS = {
    branch: {
        icon: '🌿',
        label: 'Branch',
        angle: 45,
        action: () => showBranchModal()
    },
    branchAndReset: {
        icon: '🔄',
        label: 'Action 1',
        angle: 90,
        action: () => branchAndReset()
    },
    saveBranch: {
        icon: '💾',
        label: 'Action 2',
        angle: 135,
        action: () => saveBranch()
    },
    extraOption: {
        icon: '⚙️',
        label: 'Action 3',
        angle: 180,
        action: () => showSettings()
    }
};

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

    const radius = 80;

    Object.values(MENU_ACTIONS).forEach((option, index) => {
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

// Show the branch modal with sub-options
function showBranchModal() {
    // Remove any existing modal
    const existingModal = document.querySelector('#claude-branch-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal backdrop
    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'claude-branch-modal';
    modalBackdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: #2d2d2d;
        border-radius: 12px;
        padding: 24px;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        color: white;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;

    // Modal title
    const title = document.createElement('h3');
    title.textContent = 'Branch Conversation';
    title.style.cssText = `
        margin: 0 0 20px 0;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        color: #e18a6c;
    `;

    // Modal description
    const description = document.createElement('p');
    description.textContent = 'Choose how you want to branch this conversation:';
    description.style.cssText = `
        margin: 0 0 24px 0;
        font-size: 14px;
        color: #ccc;
        text-align: center;
    `;

    // Branch options container
    const optionsContainer = document.createElement('div');
    optionsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
    `;

    // Branch whole conversation option
    const wholeBranchOption = createModalOption(
        '🌿',
        'Branch Entire Conversation',
        'Start a new chat with the full conversation history',
        () => {
            closeBranchModal();
            branchConversation();
        }
    );

    // Branch from here option
    const fromHereBranchOption = createModalOption(
        '✂️',
        'Branch from Selection',
        'Branch from a specific point in the conversation',
        () => {
            closeBranchModal();
            branchFromSelection();
        }
    );

    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        margin-top: 16px;
        padding: 8px 16px;
        background-color: transparent;
        border: 1px solid #666;
        border-radius: 6px;
        color: #ccc;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
    `;

    cancelButton.addEventListener('mouseover', () => {
        cancelButton.style.backgroundColor = '#3d3d3d';
        cancelButton.style.borderColor = '#888';
    });

    cancelButton.addEventListener('mouseout', () => {
        cancelButton.style.backgroundColor = 'transparent';
        cancelButton.style.borderColor = '#666';
    });

    cancelButton.addEventListener('click', closeBranchModal);

    // Assemble modal
    optionsContainer.appendChild(wholeBranchOption);
    optionsContainer.appendChild(fromHereBranchOption);
    
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(optionsContainer);
    modalContent.appendChild(cancelButton);
    
    modalBackdrop.appendChild(modalContent);
    document.body.appendChild(modalBackdrop);

    // Show modal with animation
    setTimeout(() => {
        modalBackdrop.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);

    // Close modal when clicking backdrop
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeBranchModal();
        }
    });

    // Prevent modal content clicks from closing modal
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Create a modal option button
function createModalOption(icon, title, description, action) {
    const option = document.createElement('div');
    option.style.cssText = `
        display: flex;
        align-items: center;
        padding: 16px;
        background-color: #3d3d3d;
        border: 2px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    `;

    const iconEl = document.createElement('div');
    iconEl.textContent = icon;
    iconEl.style.cssText = `
        font-size: 24px;
        margin-right: 16px;
        flex-shrink: 0;
    `;

    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
        flex: 1;
    `;

    const titleEl = document.createElement('div');
    titleEl.textContent = title;
    titleEl.style.cssText = `
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
        color: white;
    `;

    const descEl = document.createElement('div');
    descEl.textContent = description;
    descEl.style.cssText = `
        font-size: 13px;
        color: #aaa;
        line-height: 1.4;
    `;

    textContainer.appendChild(titleEl);
    textContainer.appendChild(descEl);
    
    option.appendChild(iconEl);
    option.appendChild(textContainer);

    // Hover effects
    option.addEventListener('mouseover', () => {
        option.style.backgroundColor = '#4d4d4d';
        option.style.borderColor = '#e18a6c';
    });

    option.addEventListener('mouseout', () => {
        option.style.backgroundColor = '#3d3d3d';
        option.style.borderColor = 'transparent';
    });

    option.addEventListener('click', action);

    return option;
}

// Close the branch modal
function closeBranchModal() {
    const modal = document.querySelector('#claude-branch-modal');
    if (modal) {
        modal.style.opacity = '0';
        const content = modal.querySelector('div');
        if (content) {
            content.style.transform = 'scale(0.8)';
        }
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Close modal with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBranchModal();
    }
});

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
    showStatus("Action 1 - Feature coming soon!", 2000);
    // TODO: Implement branch and reset functionality
}

// Save current branch state
function saveBranch() {
    console.log("Save Branch clicked");
    showStatus("Action 2 - Feature coming soon!", 2000);
    // TODO: Implement branch saving functionality
}

// Settings/extra option placeholder
function showSettings() {
    console.log("Settings clicked");
    showStatus("Action 3 - Feature coming soon!", 2000);
    // TODO: Implement settings functionality
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
    document.addEventListener('DOMContentloaded', initialize);
} else {
    initialize();
}

window.addEventListener('load', initialize);
setTimeout(initialize, 1000);