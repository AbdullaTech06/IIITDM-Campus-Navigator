# GitHub Pages Deployment Guide

Follow these simple steps to deploy your IIITDM Campus Navigator on GitHub Pages.

## Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. Name it: `IIITDM-Campus-Navigator`
5. Add description: "Campus navigation system for IIITDM Kurnool"
6. Set to **Public** (required for free GitHub Pages)
7. **DO NOT** initialize with README (we already have one)
8. Click **Create repository**

### 2. Upload Your Code

#### Option A: Using Git Command Line

```bash
# Initialize git in your project folder
cd IIITDM-Campus-Navigator
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: IIITDM Campus Navigator"

# Add remote repository (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/IIITDM-Campus-Navigator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Option B: Using GitHub Web Interface

1. On your new repository page, click **uploading an existing file**
2. Drag and drop all files:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - `LICENSE`
   - `.gitignore`
3. Add commit message: "Initial commit"
4. Click **Commit changes**

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab (top menu)
3. Click **Pages** in the left sidebar
4. Under **Source**:
   - Branch: Select `main`
   - Folder: Select `/ (root)`
5. Click **Save**

### 4. Wait for Deployment

- GitHub will show: "Your site is ready to be published at..."
- Wait 2-3 minutes for the build to complete
- Refresh the page
- You'll see: "Your site is live at..."

### 5. Access Your Site

Your live URL will be:
```
https://YOUR-USERNAME.github.io/IIITDM-Campus-Navigator/
```

### 6. Update README (Optional)

Edit the README.md file and replace:
```markdown
Visit the live application: [IIITDM Campus Navigator](https://your-username.github.io/IIITDM-Campus-Navigator/)
```

With your actual GitHub username.

## Updating Your Site

To make changes after deployment:

```bash
# Make your changes to the files
# Then:
git add .
git commit -m "Description of changes"
git push origin main
```

GitHub Pages will automatically rebuild in 1-2 minutes.

## Troubleshooting

### Site Not Loading?
- Wait 5 minutes and try again
- Check that repository is **Public**
- Verify **Pages** is enabled in Settings
- Make sure `index.html` is in the root folder

### 404 Error?
- Check the URL is correct
- Ensure branch is set to `main` (not `master`)
- Verify files were uploaded correctly

### Map Not Showing?
- Check browser console (F12) for errors
- Verify internet connection
- Make sure Leaflet.js CDN links are accessible

## Custom Domain (Optional)

If you have a custom domain:

1. In **Pages** settings, enter your domain in **Custom domain**
2. Add a `CNAME` file to your repository with your domain name
3. Configure DNS settings with your domain provider

## Need Help?

- Check [GitHub Pages Documentation](https://docs.github.com/en/pages)
- Contact your team members
- Open an issue in the repository

---

**Good luck with your deployment! 🚀**
