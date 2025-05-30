# Claude Branch Extension

## Overview
Claude Branch is a browser extension that enhances your Claude.ai experience with quick access to branching options and custom prompts. This tool helps you explore different conversation directions without losing context and provides rapid access to frequently used prompts and actions.

<img width="1188" alt="Screenshot 2025-05-30 at 11 48 56 AM" src="https://github.com/user-attachments/assets/cb0f09db-ea6c-44c6-b405-f7961bc5e4c1" />

## Features
- **Radial Quick-Access Menu**: Floating 🌿 button that opens a radial menu for instant access to actions
- **Conversation Branching**: Create new conversation threads without losing original context
- **Custom Prompt Access**: Quick access to user-defined prompts and actions (coming soon)
- **Smart Conversation Extraction**: Intelligently captures conversation context for branching
- **Modal Dialog System**: Interactive dialogs with detailed options and descriptions
- **Multiple Branch Types**: 
  - Branch entire conversation to new tab
  - Branch from specific selection points (coming soon)
- **Customizable Actions**: Configurable menu items for personalized workflows
- **Enhanced UX**: Smooth animations, tooltips, and keyboard shortcuts (ESC to close)

## Installation
1. Clone this repository or download the ZIP file
2. Open Chrome or Brave and navigate to `chrome://extensions/` (or `brave://extensions/`)
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory
5. The extension will automatically activate on Claude.ai pages

## Usage
### Basic Branching
1. While in a Claude.ai conversation, click the 🌿 button in the bottom-left corner
2. A radial menu will appear with available actions
3. Click the "Branch" option (🌿) to open the branching modal
4. Choose between:
   - **Branch Entire Conversation**: Creates a new tab with the full conversation history
   - **Branch from Selection**: Branch from a specific point (coming soon)
5. Continue your conversation in the new tab - changes won't affect the original conversation

### Quick Actions (Coming Soon)
- Click any of the other menu items to access custom prompts and predefined actions
- Configure your own shortcuts for frequently used prompts
- Set up workflow automations for common tasks

## Interface Elements
- **Main Button**: Circular 🌿 button that toggles the radial menu
- **Radial Menu**: Fan-style menu with 4 customizable action slots
- **Branch Modal**: Detailed dialog for selecting branching type
- **Action Slots**: Configurable menu items for custom prompts and quick actions
- **Tooltips**: Hover descriptions for all menu items
- **Status Notifications**: Non-intrusive status messages for user feedback

## Files
- `background.js`: Handles tab creation and prompt injection
- `content.js`: Manages the UI elements, radial menu, modal dialogs, conversation extraction, and action system
- `manifest.json`: Extension configuration and permissions

## Technical Features
- **Centralized Configuration**: Actions configured in `MENU_ACTIONS` object for easy customization
- **Extensible Action System**: Framework for adding custom prompts and user-defined actions
- **Responsive Design**: Adapts to different screen sizes and positions
- **Event Handling**: Click-outside-to-close, escape key support, and proper event propagation
- **Animation System**: Smooth transitions for menu appearance, button interactions, and modal dialogs
- **Modular Architecture**: Easily extensible for new action types and custom workflows

## Permissions
- `storage`: Required to temporarily store prompts between tabs and save custom actions
- Host permissions for Claude.ai domains

## Compatibility
Works with Claude.ai web interface. Compatible with Chrome, Brave, and other Chromium-based browsers.

## Planned Features
- **Custom Prompt Library**: Save and organize frequently used prompts
- **Quick Prompt Insertion**: One-click access to predefined prompts
- **Branch from Selection**: Branch from specific conversation points
- **Workflow Automation**: Chain multiple actions together
- **Prompt Templates**: Customizable templates with variables
- **Action Categories**: Organize actions by type (creative, analytical, technical, etc.)
- **Import/Export Settings**: Share action configurations between devices
- **Conversation Management**: Save and manage multiple branch states

## Use Cases
- **Content Creation**: Quick access to writing prompts and style guides
- **Code Development**: Instant access to debugging and optimization prompts
- **Research & Analysis**: Streamlined access to analytical frameworks
- **Creative Projects**: Rapid switching between creative directions
- **Learning & Education**: Quick access to explanation and tutoring prompts
- **Business & Productivity**: Automated workflows for common business tasks
