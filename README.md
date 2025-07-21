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

`ych/admin.html` provides a simple local admin interface. Log in with the
password `artadmin` to add, edit or remove YCH entries. Images can be uploaded
from your computer; they are stored as data URLs in `localStorage` so no GitHub
upload is needed. All changes only affect your browser and override
`ychs.json` when rendering the normal YCH page.
