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

The site now includes a small Node.js backend (`server.js`) that exposes
`/api/ychs` for reading and writing `ych/ychs.json`. Run `npm install` followed
by `npm start` to launch the server locally. The admin page will send updates to
this endpoint so you can modify the JSON file without setting up an external
API key. Provide an image URL for each entry and the preview will update as you
type.
