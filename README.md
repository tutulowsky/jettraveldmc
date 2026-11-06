# Jet Travel DMC – jettraveldmc.com

Static HTML/CSS/JS version of [jettraveldmc.com](https://jettraveldmc.com/), converted from the former WordPress site (Elementor + Slider Revolution) to remove the WordPress security surface. It runs on any Apache host (cPanel) – no database, no PHP except the contact form.

## Structure

```
public_html/           ← upload the contents of this folder to cPanel public_html
  index.html           home page; every other page is <slug>/index.html (same URLs as on WordPress)
  404.html
  .htaccess            HTTPS + non-www redirect, blocks old WP endpoints, security headers, caching
  send.php             contact form handler (mail() → info@jettraveldmc.com)
  sitemap.xml, robots.txt
  assets/              custom additions on top of the original site
    mobile-menu.css/js   mobile menu (≤1024px)
    site-fixes.css       layout fixes (hero under header, blog post titles, desktop dropdown, hero poster)
    aquatics.css/js      home page "World Aquatics Masters Championships 2027" card + video modal
    img/, video/         card image, posters, Aquatics video (1080p desktop, 720p mobile)
  wp-content/, wp-includes/   original theme/plugin assets and uploads (static files only)
qr/                    QR code for the Aquatics video (SVG for print, PNG)
```

## Editing

The HTML files in `public_html/` are the source of truth – edit them directly. Shared header/footer markup is repeated in every page, so a menu or footer change has to be made in all `index.html` files.

- Mobile menu items are read from the desktop menu automatically; contact details in the menu are at the top of `assets/mobile-menu.js`.
- Contact form recipient / sender: top of `send.php`.

## Deep link

`https://jettraveldmc.com/#aquatics` opens the home page and starts the Aquatics video immediately (used by the printed QR code, with `utm_*` parameters for Analytics).

## Deploy

Upload the contents of `public_html/` to the cPanel `public_html` folder (overwrite). After deploying, check that e.g. `/wp-content/plugins/elementor-pro/assets/lib/sticky/jquery.sticky.min.js` loads – after the first upload a few JS files were missing on the server (possibly removed by the host's malware scanner).
