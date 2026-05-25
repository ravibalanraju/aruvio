# Aruvio Site

Premium static landing site for **Aruvio**, built to present the company as a modern brand that handles:

- internet-related services
- AI and intelligent automation
- cybersecurity support
- modelling and solution planning
- digital platforms
- app development
- software development
- branding systems
- digital marketing
- editing and creative support
- cloud and automation workflows
- networking
- storage servers
- infrastructure support
- direct contact-based business inquiries

The design uses the provided logo and includes detailed service explanations, company growth positioning, and a clear step-by-step process section.

## Files

- `index.html` - page structure and content
- `styles.css` - full visual system, layout, theming, and responsive styling
- `script.js` - scroll progress, reveals, counters, theme toggle, cursor effects, and service tabs
- `assets/aruvio-logo.png` - copied logo asset

## Run locally

This is a static site, so you can use either option:

1. Open `index.html` directly in a browser.
2. Or run a local server from this folder:

```powershell
cd C:\Users\jsnav\Desktop\Site
py -m http.server 5500
```

Then open `http://localhost:5500`.

## What is included in the design

1. Sticky glass-style header with active section highlighting
2. Premium hero section built around the logo
3. Smooth section reveal animations on scroll
4. Floating orbit labels around the logo
5. Animated progress bar at the top of the page
6. Grouped service area for AI, apps, software, branding, marketing, editing, and infrastructure support
7. Animated counters
8. Dark and light mode toggle with saved preference
9. Custom cursor effects and click burst animation
10. Detailed six-step process section
11. Capability stack covering AI, cybersecurity, modelling, apps, software, cloud, branding, and growth support
12. Company growth section covering service expansion and long-term support
13. Infrastructure section covering software and hardware capability
14. FAQ and real contact section with email and mobile numbers
15. Responsive layout for desktop and mobile

## GitHub publishing steps

If you want this project on GitHub, use these exact steps inside `C:\Users\jsnav\Desktop\Site`.

### 1. Initialize git

```powershell
git init -b main
```

### 2. Add the files

```powershell
git add .
```

### 3. Create the first commit

```powershell
git commit -m "Build Aruvio company site"
```

### 4. Create a new empty GitHub repository

Create a repo in your GitHub account, for example:

- `aruvio-site`

Do not add a README, `.gitignore`, or license from GitHub if this folder already has those files.

### 5. Connect the local project to GitHub

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your actual values.

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### 6. Push the code

```powershell
git push -u origin main
```

### 7. Optional: turn on GitHub Pages

Because this is a static site, it can be published with GitHub Pages.

After the push:

1. Open the repository on GitHub.
2. Go to `Settings`.
3. Open `Pages`.
4. Set the source to `Deploy from a branch`.
5. Choose branch `main`.
6. Choose folder `/ (root)`.
7. Save.

GitHub will give you a public website URL after deployment.

## Customization ideas

- Replace placeholder CTA links with business email, phone, or WhatsApp
- Add a contact form endpoint
- Add project case studies
- Add service detail pages
- Connect analytics and lead capture
