// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openNewTab") {
    // Open a new tab with Claude
    chrome.tabs.create({ url: request.url }, (tab) => {
      // Store the prompt for this tab ID so we can use it when the page loads
      chrome.storage.local.set({ 
        [`branchPrompt_${tab.id}`]: request.prompt 
      }, () => {
        console.log("Stored prompt for tab", tab.id);
      });
      
      sendResponse({ success: true, tabId: tab.id });
    });
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
});

// Listen for tab updates to inject the prompt when the new Claude page is ready
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('claude.ai/chats/new')) {
    // Check if we have a stored prompt for this tab
    chrome.storage.local.get([`branchPrompt_${tabId}`], (result) => {
      const prompt = result[`branchPrompt_${tabId}`];
      
      if (prompt) {
        // Inject a script to set the prompt in the textarea
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: (promptText) => {
            // Function to set the prompt in the textarea
            function setPrompt() {
              const textarea = document.querySelector('textarea, [role="textbox"]');
              
              if (textarea) {
                // Set the value
                textarea.value = promptText;
                
                // Trigger input events
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                
                console.log("Prompt set in textarea");
                return true;
              }
              
              return false;
            }
            
            // Try immediately
            if (!setPrompt()) {
              // If not successful, try again after a delay
              setTimeout(() => {
                setPrompt();
              }, 1000);
            }
          },
          args: [prompt]
        });
        
        // Clear the stored prompt
        chrome.storage.local.remove([`branchPrompt_${tabId}`]);
      }
    });
  }
});