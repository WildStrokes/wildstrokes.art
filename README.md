# wildstrokes.art

## Updating YCHs

All YCH slots are stored in `ych/ychs.json`. Each entry looks like:

```json
{
  "image": "filename.png",
  "title": "YCH Title",
  "usd": 45,
  "options": ["Option text", "More options"]
}
```

Add new objects or edit the existing ones to change what appears on the YCH page. Images should live in the `ych/` folder and the site will automatically render them when `ych/index.html` is loaded.

### Editing via Admin Page

To update YCHs without using GitHub directly, open `ych/admin.html` in your browser. The page is protected by a simple password (edit `js/ych-admin.js` to change it). After entering the password you can modify the JSON in the textbox and click **Save**. You'll be prompted for a GitHub token so the page can commit the changes to this repository using the GitHub API. Update the repository name inside `js/ych-admin.js` if your fork uses a different path.
