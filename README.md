# Bank Details QR Code System (Serverless)

A modern, fast, and secure client-side web application that generates QR codes for your bank details and displays them in a clean, mobile-responsive layout with a one-click copy feature.

This project runs **100% serverless** (entirely client-side) and is designed for hosting on free platforms like **GitHub Pages**.

---

## 🌟 Features

- **100% Serverless**: No database or backend server required.
- **Privacy First**: Bank details are encoded directly in the URL parameter using URL-safe Base64. Your sensitive bank information is never sent to or stored on any server.
- **Infinite Lifetime**: Because details are stored in the QR code itself, the links never expire.
- **Modern UI**: Polished glassmorphism dark theme with beautiful typography and layout.
- **Copy to Clipboard**: Scan page has a one-click button to copy all bank details securely and cleanly formatted.
- **Responsive**: Fully scalable for mobile and desktop screens.

---

## 📂 Project Structure

```
📂 QR generator
 ├── 📄 index.html      (Main form & QR generator view)
 ├── 📄 app.js          (Frontend logic for encoding bank details into a URL and creating QR)
 ├── 📄 scan.html       (Details page shown when QR is scanned)
 ├── 📄 scan.js         (Frontend logic to decode URL parameter and display details)
 ├── 📄 style.css       (Premium glassmorphism styling)
 ├── 📄 package.json    (Local development script)
 └── 📄 README.md       (Setup and deployment instructions)
```

---

## 💻 Local Testing Guide

### Option A: Double-Click (Easiest)
Simply double-click **`index.html`** in your file explorer to open it in your browser. Everything will work out-of-the-box!

### Option B: Using Local Server (Recommended)
1. Open your terminal in the project directory.
2. If you want to use npm commands, run the following to start a lightweight static server:
   ```bash
   npm start
   ```
3. Open the link displayed in the terminal (usually `http://localhost:5000` or `http://localhost:3000`) in your browser.

---

## 🚀 How to Host on GitHub Pages

Follow these simple steps to deploy your application to GitHub Pages for free:

### Step 1: Create a GitHub Repository
1. Go to [github.com](https://github.com/) and log in.
2. Click **New** to create a new repository.
3. Name your repository (e.g., `bank-qr-generator`).
4. Keep it **Public** (required for free GitHub Pages).
5. **Do not** initialize it with a README, `.gitignore`, or license (we already have them!).
6. Click **Create repository**.

### Step 2: Push your Code to GitHub
Open your terminal in the project directory (`c:\Users\imtel pro\Desktop\QR generator`) and run the following commands:

```bash
# If git is not initialized yet:
git init

# Add all files to the staging area:
git add .

# Commit your changes:
git commit -m "Configure serverless app for GitHub Pages"

# Rename default branch to main:
git branch -M main

# Link your local repo to GitHub (replace with your actual GitHub URL):
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Push your code to GitHub:
git push -u origin main
```

### Step 3: Enable GitHub Pages in Settings
1. Go to your repository page on GitHub.
2. Click the **Settings** tab (gear icon at the top).
3. In the left sidebar, scroll down to the **Code and automation** section and click **Pages**.
4. Under **Build and deployment** -> **Source**, make sure **Deploy from a branch** is selected.
5. Under **Branch**, click the dropdown that says `None`, select `main`, and keep the folder as `/ (root)`.
6. Click **Save**.

### Step 4: Access Your Live Site!
* Wait 1 to 2 minutes for GitHub Actions to build and deploy your site.
* Refresh the Pages settings page, and you will see a banner at the top: **"Your site is live at: ..."**
* The URL will look like: `https://<your-username>.github.io/<your-repo-name>/`

Now, any QR code generated on your site will automatically point to your hosted `scan.html` on GitHub Pages and can be scanned by any smartphone globally!
