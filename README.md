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

Add new objects or edit the existing ones to change what appears on the YCH page.
Images should live in the `ych/` folder and the site will automatically render
them when `ych/index.html` is loaded.

### Admin page


`ych/admin.html` provides a password protected admin interface. Log in with the
password `artadmin` to add, edit or remove YCH entries.

The admin page automatically loads and saves `ychs.json` from the endpoint
defined in `js/admin-ych.js`. Press **Save Changes** to update the JSON store
with any edits. Provide an image URL for each entry and the preview will update
as you type.
