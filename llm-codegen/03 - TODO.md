# Everything Converter Chrome Extension - Todo Checklist

## 1. Project Setup and Environment
- [ ] **Create Project Structure**
  - [ ] Create a project directory.
  - [ ] Create the following files:
    - manifest.json
    - popup.html
    - background.js
    - settings.html
    - conversion.js
    - popup.js
    - settings.js
- [ ] **Configure Manifest**
  - [ ] Add `manifest_version`, `name`, `version`, and `description`.
  - [ ] Declare necessary permissions (e.g., contextMenus, storage, activeTab).
  - [ ] Declare the popup page, background script, and any icons.
- [ ] **Set Up Development Tools**
  - [ ] Initialize version control (e.g., git).
  - [ ] Set up a local environment for testing Chrome extensions.

## 2. Core Conversion Logic (conversion.js)
- [ ] **Define Conversion Factors and Formulas**
  - [ ] Create a JavaScript object or JSON structure with conversion factors for:
    - Length
    - Weight
    - Temperature (include special formulas)
    - Volume
    - Speed
    - Area
- [ ] **Implement the Conversion Function**
  - [ ] Create a function `convert(value, category, fromUnit, toUnit)` that:
    - Reads conversion factors.
    - Handles function-based conversions (e.g., temperature).
    - Returns an error for unsupported conversions.
- [ ] **Implement Unit Validation**
  - [ ] Write a helper function to validate if the selected units belong to the same category.

## 3. Popup User Interface
- [ ] **Design the Popup (popup.html)**
  - [ ] Add a header with:
    - Title "Everything Converter"
    - Settings icon (link to settings page)
  - [ ] Create a conversion input section:
    - Numeric input field for the value.
    - Dropdown for selecting the conversion category.
    - Dropdowns for the "from" and "to" units.
    - A button to reverse the units.
    - A "Convert" button.
  - [ ] Add a section to display conversion results.
  - [ ] Include a collapsible/scrollable history section.
- [ ] **Implement Popup Functionality (popup.js)**
  - [ ] Write code to dynamically populate dropdowns based on the selected category using a predefined unit mapping.
  - [ ] Add an event listener on the "Convert" button to:
    - Read input values.
    - Call the conversion function from conversion.js.
    - Display the result.
  - [ ] Integrate UI updates for errors or invalid inputs.

## 4. Conversion History Feature
- [ ] **Implement Storage Integration in popup.js**
  - [ ] Use Chrome's storage API to save each successful conversion.
  - [ ] Store a maximum of 20 conversion records.
- [ ] **Manage History Display**
  - [ ] Load history on popup load.
  - [ ] Render each conversion in the history section in a user-friendly format.
  - [ ] Add a "Clear History" button with functionality to remove all entries.
  - [ ] Allow individual deletion of history entries (optional).

## 5. Inline Conversions via Context Menu (background.js)
- [ ] **Setup Context Menu**
  - [ ] In background.js, create a context menu item titled "Convert with Everything Converter" that appears on text selection.
- [ ] **Implement Inline Conversion Handling**
  - [ ] Add an event listener for the context menu click:
    - Parse the selected text to extract a numeric value and unit.
    - Validate the parsed input.
    - Optionally prompt the user to select the target unit if not automatically determinable.
  - [ ] Implement display of conversion results:
    - Use a tooltip or modal to show the result on the active tab.
  - [ ] Ensure proper error handling for unsupported or invalid conversions.

## 6. Settings Page (settings.html & settings.js)
- [ ] **Design Settings Page (settings.html)**
  - [ ] Create a form with options to set:
    - Default conversion category.
    - Default "from" and "to" units.
    - Toggle for enabling/disabling conversion history.
    - Inputs for keyboard shortcut configuration.
    - Light Mode/Dark Mode selection.
  - [ ] Add "Save" and "Reset" buttons.
- [ ] **Implement Settings Functionality (settings.js)**
  - [ ] Load current settings from chrome.storage when the page loads.
  - [ ] Save updated settings to chrome.storage on "Save" button click.
  - [ ] Reset settings to default values on "Reset" button click.
  - [ ] Provide user feedback (e.g., confirmation messages) after saving or resetting.

## 7. Final Integration and Testing
- [ ] **Ensure Module Integration**
  - [ ] Import/use conversion.js in both popup.js and background.js.
  - [ ] Ensure settings.js correctly interacts with chrome.storage and reflects changes in the popup.
- [ ] **Test End-to-End Functionality**
  - [ ] Test the popup conversion flow:
    - Input, dropdown selection, conversion, and result display.
  - [ ] Test conversion history:
    - Saving, loading, and clearing conversion records.
  - [ ] Test inline conversion via context menu:
    - Right-click selection, conversion parsing, and result display.
  - [ ] Test settings page:
    - Loading, updating, and resetting settings.
- [ ] **Final Debugging**
  - [ ] Check error handling across all modules.
  - [ ] Ensure there is no orphaned or unintegrated code.
  - [ ] Update documentation and comments where necessary.
- [ ] **Deployment Preparation**
  - [ ] Finalize version numbers and update manifest.json.
  - [ ] Package the extension for deployment or submission.

## 8. Documentation and Cleanup
- [ ] **Document the Code**
  - [ ] Ensure inline comments are clear and descriptive.
  - [ ] Update README.md with installation, usage, and contribution instructions.
- [ ] **Clean Up Code**
  - [ ] Remove any unused files or code snippets.
  - [ ] Validate file formats and project structure.
