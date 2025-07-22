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

For quick edits, open `ych/editor.html` in your browser. It now shows each YCH
in a small form so you can easily change the image path, title, price and
options. Use the **Add YCH** button to insert new entries or the **Remove**
button to delete them. When you're done, click **Download JSON** and commit the
file back to the repo.

