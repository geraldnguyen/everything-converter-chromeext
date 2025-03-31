## High-Level Blueprint

1.  **Project Setup and Environment**
    
    *   **Create the basic project structure:**
        
        *   Set up a directory with required files (e.g., manifest.json, popup.html, background.js, settings.html, and related JavaScript/CSS files).
            
        *   Configure the manifest (permissions, icons, version, etc.).
            
    *   **Establish development tooling:**
        
        *   Use a version control system.
            
        *   Set up a local testing environment for Chrome extensions.
            
2.  **Core Conversion Logic**
    
    *   **Define conversion formulas and factors:**
        
        *   Create a module (e.g., conversion.js) that contains conversion factors and functions (including special cases like temperature conversion).
            
    *   **Implement error handling and unit validation:**
        
        *   Create functions to validate unit mappings.
            
        *   Provide clear error messages for unsupported conversions.
            
3.  **Popup UI Implementation**
    
    *   **Design and build the popup interface:**
        
        *   Create the HTML structure with a header, input field, dropdowns (for category, from-unit, and to-unit), a convert button, and a section for results.
            
        *   Implement dynamic population of dropdowns based on selected conversion category.
            
    *   **Wire up events:**
        
        *   Write JavaScript to handle user interactions, trigger conversions, and update the results section.
            
4.  **Conversion History Feature**
    
    *   **Persist conversion history:**
        
        *   Use Chrome’s storage APIs to save the last 20 conversions.
            
    *   **Display and manage history in the popup:**
        
        *   Create a history section that shows past conversions with options to delete individual entries or clear all history.
            
5.  **Inline (Context Menu) Conversions**
    
    *   **Setup context menu integration:**
        
        *   Use background scripts to add a context menu option.
            
        *   Implement logic to parse highlighted text, validate input, and trigger a conversion.
            
    *   **Display conversion results inline:**
        
        *   Show results in a tooltip or modal next to the selected text.
            
6.  **Settings Page**
    
    *   **Design the settings interface:**
        
        *   Build a settings page with options for default units, history toggle, keyboard shortcuts, and appearance (light/dark mode).
            
    *   **Wire settings functionality:**
        
        *   Save user preferences using chrome.storage.
            
        *   Ensure changes are applied across the extension.
            
7.  **Integration and Final Wiring**
    
    *   **Ensure all modules communicate effectively:**
        
        *   The conversion logic should be shared by the popup, context menu, and settings.
            
        *   Establish error handling and consistent UI behaviors.
            
    *   **Perform end-to-end testing and debugging:**
        
        *   Validate the extension in Chrome and test all user flows (popup conversion, inline conversion, and settings changes).
            

## Iterative Breakdown into Small, Interdependent Steps

For each phase, we further break down the tasks into small chunks that build on one another. For example:

### Project Setup

*   **Step 1:** Create a basic file structure with a manifest, popup.html, and background.js.
    
*   **Step 2:** Populate the manifest with the necessary permissions (e.g., contextMenus, storage) and declare the popup and background scripts.
    
*   **Step 3:** Create placeholder files for settings.html and conversion logic (conversion.js).
    

### Conversion Logic

*   **Step 1:** Draft a JSON or JavaScript object containing conversion factors.
    
*   **Step 2:** Write basic conversion functions that use the factors.
    
*   **Step 3:** Implement unit validation and special case functions (e.g., temperature conversion).
    

### Popup UI

*   **Step 1:** Create the HTML structure for the popup, including header, input, dropdowns, and result section.
    
*   **Step 2:** Add CSS to ensure a user-friendly interface.
    
*   **Step 3:** Write JavaScript to handle input events and dynamic dropdown updates based on category.
    
*   **Step 4:** Connect the conversion logic to update the result section.
    

### Conversion History

*   **Step 1:** Define how history is stored (using chrome.storage).
    
*   **Step 2:** Implement saving a conversion after each successful conversion.
    
*   **Step 3:** Build UI elements for displaying history and adding buttons for deletion/clearing.
    
*   **Step 4:** Wire up events to update storage when history is modified.
    

### Inline Conversions (Context Menu)

*   **Step 1:** Write the background script to add a context menu item.
    
*   **Step 2:** Implement parsing of the highlighted text and validating the conversion input.
    
*   **Step 3:** Create a mechanism (tooltip/modal) to display inline conversion results.
    
*   **Step 4:** Ensure error handling and messaging for unsupported inputs.
    

### Settings Page

*   **Step 1:** Design the HTML layout of the settings page.
    
*   **Step 2:** Implement the form controls for default units, history toggle, keyboard shortcuts, and appearance.
    
*   **Step 3:** Write JavaScript to save these settings to chrome.storage and load them on page load.
    
*   **Step 4:** Integrate a “Save” button and a “Reset” button with proper event handling.
    

### Final Integration

*   **Step 1:** Confirm that the conversion logic is shared among popup, inline conversion, and settings.
    
*   **Step 2:** Test all user flows and ensure consistency.
    
*   **Step 3:** Add final wiring to handle global error messaging and logging.
    

## Series of Prompts for a Code-Generation LLM

Below are the iterative prompt sections, each in its own markdown code block tagged as text. Each prompt builds on the previous ones and ensures that every piece of code is integrated with no orphaned modules.

### Prompt 1: Project Setup and Basic File Structure


```
We are building the "Everything Converter" Chrome extension. Begin by setting up the basic project structure. Create the following files with placeholder content:
- manifest.json (include basic fields: manifest_version, name, version, description, and permissions for contextMenus, storage, and activeTab).
- popup.html (with a basic HTML skeleton for the extension popup).
- background.js (for managing background tasks, such as context menu creation).
- settings.html (a basic HTML file for the settings page).
- conversion.js (a placeholder JavaScript file for conversion logic).

Ensure the manifest correctly declares the popup and background scripts. Your output should include the contents of each file.
```

### Prompt 2: Implementing Core Conversion Logic

```
Now, create the core conversion logic module in conversion.js. This module should:
- Define a JavaScript object or JSON structure containing conversion factors for different categories (e.g., length, weight, temperature).
- Implement a function "convert(value, category, fromUnit, toUnit)" that uses these factors.
- Handle special cases such as temperature conversions with custom formulas.
- Include error handling for unsupported conversions.
Output the complete code for conversion.js with inline comments explaining each part.
``` 

### Prompt 3: Building the Popup UI

```
Develop the popup interface for the extension. Update popup.html to include:
- A header with the title "Everything Converter" and a settings icon.
- A conversion input section with an input field for the numeric value, dropdowns for selecting the conversion category, the from-unit, and the to-unit.
- A "Convert" button.
- A section to display the conversion result.
Next, create popup.js to:
- Dynamically populate the dropdowns based on the selected conversion category using a unit mapping (e.g., an object that maps categories to unit arrays).
- Wire up an event listener on the "Convert" button that reads the input values, calls the conversion function from conversion.js, and displays the result.
Output both popup.html and popup.js with clear comments and ensure they work together.
``` 

### Prompt 4: Adding the Conversion History Feature

```
Enhance the popup by adding a conversion history feature. Modify the popup interface and create history functionality as follows:
- In popup.html, add a collapsible or scrollable section that will display the last 20 conversions.
- In popup.js, integrate Chrome’s storage API to persist the conversion history across sessions.
- Implement functions to save a new conversion to history, load history on popup load, and clear the history when the user clicks a "Clear History" button.
Ensure that each history entry is displayed in a user-friendly format and that storage is updated properly.
Output the updated popup.js (and any required HTML changes) with inline comments.
``` 

### Prompt 5: Implementing Inline Conversion via Context Menu

```
Implement the inline conversion feature using a context menu. Update background.js to:
- Create a context menu item titled "Convert with Everything Converter" that appears when the user selects text.
- Add an event listener that parses the selected text (e.g., "10 kg"), determines the numeric value and unit, and triggers the conversion logic (you can prompt the user for the target unit if needed).
- Implement a simple method to display the conversion result in a tooltip or modal on the active tab.
Ensure that error handling is in place for invalid or unsupported selections.
Output the updated background.js code with inline comments detailing each step.
``` 

### Prompt 6: Creating the Settings Page

```
Build the settings page for the extension. In settings.html, create a form that includes:
- Options to set the default conversion category and default units.
- A toggle to enable or disable the conversion history feature.
- Inputs for configuring keyboard shortcuts.
- An option to switch between Light Mode and Dark Mode.
Include "Save" and "Reset" buttons.
Next, in a new file settings.js (or included via a script tag in settings.html), write the JavaScript to:
- Load existing settings from chrome.storage on page load.
- Save updated settings when the user clicks "Save."
- Reset the settings to default when "Reset" is clicked.
Output the complete settings.html and settings.js with clear comments.
``` 

### Prompt 7: Final Integration and Wiring

```
Integrate all components of the Everything Converter extension. Ensure that:
- The conversion logic in conversion.js is imported/used by both popup.js and background.js.
- The popup, context menu (background.js), and settings page (settings.js) share a consistent set of units and conversion formulas.
- All error handling, dynamic UI updates, and persistent storage operations work as expected.
- There are no orphaned pieces of code—each module builds on previous steps and is wired together.
Provide a summary of any additional integration steps or final testing instructions, and output a final integration guide.
```

### Improvement and Bugs

1. Inside popup.html:
- Move "Category" dropdown to above "From unit" and "value"
- Align the size of the "value" field to align witht the rest of the fields
- Reduce the size of the Setting button and expand the "Everything Converter" title
- Reduce the size of the "Clear History" button and expand the "Recent Conversion" title

2. Inside popup.html: The Setting and Clear History buttons are still large. Reduce their width to maximum 30% of available space

3. Bug: Appearance (light mode, dark mode) is not reflected after setting updated

4. Bug: Enable conversion history setting not followed: all conversions are recorded

5. When concersion history is enabled, the conversion performed should immediately visble under "Recent conversions" section. 