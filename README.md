# NDÛZAVÉL — Apps, AI & Gaming

> **Official Sovereign Technology Platform owned by Mr. Tyler Ndu**  
> **Target Production Domain:** [https://nduzaveltech.com](https://nduzaveltech.com)  
> **Founder Email:** [tylerndu72@gmail.com](mailto:tylerndu72@gmail.com)

---

## 🌟 Overview

**NDÛZAVÉL** is a modern, premium, high-performance technology platform uniting:
- **Autonomous AI Studio:** Interactive prompt engine & multi-agent reasoning playground.
- **Hardware-Accelerated Gaming:** Custom 60 FPS HTML5 canvas vector runner (*HexaRun: Cyber Vector*).
- **Private Digital Vault:** Zero-knowledge client-side encrypted repository for notes, secrets, patents, and blue-prints protected by master PIN.
- **Real-Time Community Nexus:** Multi-channel community chat (`#general-tech`, `#gaming-zone`, `#ai-lab`) with direct messaging and moderation tools.
- **Owner Command Dashboard:** Code-free CMS, project catalog manager, member governance, and automated JSON backups.
- **Mobile-First Experience:** Fully optimized for touch interaction on Android smartphones.

---

## 🚀 How to Publish to GitHub (Step-by-Step)

Follow these exact steps to publish this codebase to your own GitHub account:

### Step 1: Create a New Repository on GitHub
1. Sign in to your account at [github.com](https://github.com).
2. Click the **`+`** icon in the top right corner and select **New repository**.
3. Name your repository (e.g., `nduzavel-tech` or `nduzavel`).
4. Set visibility to **Public** or **Private** (according to your preference).
5. **Do NOT** check "Add a README file" (we already have a complete one here).
6. Click **Create repository**.
7. Copy your repository's HTTPS URL (e.g., `https://github.com/YOUR_USERNAME/nduzavel-tech.git`).

---

### Step 2: Push Your Code via Terminal

Open your terminal in this project root directory and run the following commands:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "feat: initial release of NDÛZAVÉL platform for nduzaveltech.com"

# 4. Rename the default branch to main
git branch -M main

# 5. Connect your remote GitHub repository (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/nduzavel-tech.git

# 6. Push code to GitHub
git push -u origin main
```

---

### Alternative: Using GitHub Desktop (No Command Line)
1. Download and open [GitHub Desktop](https://desktop.github.com/).
2. Click **File** → **Add Local Repository...**.
3. Select this folder.
4. Click **Publish repository** to automatically create the repo on your GitHub account and push all files.

---

## 🌐 Deploying to `nduzaveltech.com` for Free

Once your code is on GitHub:

1. **Go to [Vercel](https://vercel.com)** (Free Hobby tier) or **[Netlify](https://netlify.com)**.
2. Sign in with GitHub and click **Add New Project**.
3. Select your `nduzavel-tech` repository.
4. Click **Deploy** (Vercel automatically configures Vite build commands).
5. Under **Project Settings** → **Domains**, add `nduzaveltech.com`.
6. Add the following DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):
   - **Type A**: Host `@` → Value `76.76.21.21`
   - **Type CNAME**: Host `www` → Value `cname.vercel-dns.com`
   - **Type TXT**: Host `@` → Value `nduzavel-verification=owner-tylerndu-2026`
7. Your site is now live at **`https://nduzaveltech.com`** with free automatic HTTPS/SSL!

---

## 📱 Running & Managing from Android

- Open `https://nduzaveltech.com` in Google Chrome on your Android smartphone.
- Tap Chrome menu (**⋮**) → **Add to Home screen**.
- Launch NDÛZAVÉL anytime like a native mobile app to edit content, manage members, and unlock your vault.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run dev server on port 3000
npm run dev

# Run unit tests
npx tsx --test src/utils/*.test.ts

# Build for production
npm run build
```

---

## 📄 License & Ownership
Copyright © 2026 NDÛZAVÉL. Owned and operated by **Mr. Tyler Ndu**. All rights reserved.
