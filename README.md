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
password `artadmin` to add, edit or remove YCH entries. Changes are stored in
`localStorage` so they only affect your browser. They override `ychs.json` when
rendering the normal YCH page.

Uploaded images are converted to Data URLs and stored in `localStorage` as well,
so they will only appear on the device you used to upload them. Images are
automatically resized to around 800px on the longest side before saving to help
avoid hitting the browser's storage limits. If saving fails you'll get a
warning in the admin interface.

For permanent image storage the admin page supports Imgur uploads. Provide your Imgur **Client ID** and uploaded images will be sent to Imgur, returning a public URL. Update `ych/ychs.json` with these URLs to make them appear on the live site.
