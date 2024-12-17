## Supported actions

-   Generate an entity when opened
    -   All field types work - what fields are there?
-   Change format to JSON
-   Only add non-null fields
-   Add all fields
-   Add only fields on the current form
-   Intercept request and get the grid FetchXml
-   Enter custom FetchXml and have that converted into

### How it works: Generate a C# Entity

-   Worker Request: GetBasicAttributes
-   Worker returns all attributes
-   popup-entitygen creates the entity and adds it to the textarea on the popup
-   Has its own state - stores the attributes and exposes one method: render()
    -   entityname
    -   attributes
    -   nonNull - true/false
    -   haveAllAttributes - true/false - if all attributes have been fetched
-   User can click "Copy" button and that copies the script to the clipboard

-   This is also run on start

### How it works: Change format to JSON

-   Must have called "Generate a C# Entity" before so that the attributes exist.
-   Get the attributes from the popup
-   Generate the JSON from the attributes - basically just JSON.stringify with indent

### How it works: Only non-null

-   Must have called "Generate a C# Entity" before
-   sets the state, calls render() again

### How it works: Only form fields

-   This is a default

### How it works: All fields

-   If haveAllAttributes is already set, no action
-   Else, ask the worker to get all the fields, return them, rerender.

### How it works: Intercept request and get the grid FetchXml

-   Worker does this by default. Then it depends if
