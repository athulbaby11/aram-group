# ARAM GitHub Pages Deploy Checklist

Use this every time you update the website.

## 1) Commit and push changes

Run from project root:

```powershell
git add .
git commit -m "update website"
git push origin main
```

## 2) Wait for auto deploy

- GitHub Pages deploys automatically after push to `main`.
- Usually takes 1 to 3 minutes.

## 3) Verify live site

Open:

- https://athulbaby11.github.io/aram-group/
- https://athulbaby11.github.io/aram-group/products.html
- https://athulbaby11.github.io/aram-group/service.html
- https://athulbaby11.github.io/aram-group/process.html

## 4) Verify contact form

- Submit the form from any page.
- Confirm success message appears.
- Confirm row is added in Google Sheet.

## 5) GitHub Pages settings (one-time check)

In GitHub repo:

1. Settings -> Pages
2. Source: Deploy from a branch
3. Branch: `main` and `/(root)`
4. Custom domain: keep empty (for current setup)

## 6) If site does not open on one browser

1. Try private/incognito window.
2. Hard refresh (`Ctrl + F5`).
3. Clear browser cache/cookies.
4. Flush DNS:

```powershell
ipconfig /flushdns
```

5. Retry the GitHub Pages URL.
