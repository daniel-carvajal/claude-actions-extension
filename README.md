# Claude Branch Extension

## Overview
Claude Branch is a browser extension that allows you to branch your Claude.ai conversations into new tabs. This feature helps you explore different directions from a single conversation without losing context.

<img width="698" alt="Screenshot 2025-05-21 at 4 16 18 PM" src="https://github.com/user-attachments/assets/204f8668-6866-4408-9b9b-97ddcca3af3e" />


## Features
- Adds a floating "🌿 Branch" button to Claude.ai chat pages
- Captures the current conversation context when branching
- Opens a new Claude.ai tab with the conversation history pre-loaded
- Seamlessly continues your conversation in a new thread

## Installation
1. Clone this repository or download the ZIP file
2. Open Chrome or Brave and navigate to `chrome://extensions/` (or `brave://extensions/`)
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory
5. The extension will automatically activate on Claude.ai pages

## Usage
1. While in a Claude.ai conversation, click the "🌿 Branch" button in the bottom-left corner
2. A new tab will open with the current conversation context
3. Continue your conversation from there - any changes won't affect the original conversation

## Files
- `background.js`: Handles tab creation and prompt injection
- `content.js`: Manages the UI elements and extracts conversation context
- `manifest.json`: Extension configuration and permissions

## Permissions
- `storage`: Required to temporarily store prompts between tabs
- Host permissions for Claude.ai domains

## Compatibility
Works with Claude.ai web interface. Compatible with Chrome, Brave, and other Chromium-based browsers.
