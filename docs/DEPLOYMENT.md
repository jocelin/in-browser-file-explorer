# GitHub Actions Deployment Guide

This project uses a unified GitHub Actions workflow for automated CI/CD and deployment to GitHub Pages.

## Workflow Overview

**File:** `deploy-github-pages.yml`  
**Triggers:** Push to `dev` branch, Manual dispatch

**Process:**

1. **Test** → Runs validation (linting, formatting, tests)
2. **Build** → Builds application (only if tests pass)
3. **Deploy** → Deploys to GitHub Pages

## Setup

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to `dev` branch to trigger deployment

## Manual Deployment

1. Go to Actions tab
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"

## Troubleshooting

- **Deployment fails**: Check test results in Actions tab
- **Pages not updating**: Verify Pages source is set to "GitHub Actions"
- **Build errors**: Check workflow logs for dependency issues

## Benefits

- ✅ Safe deployments (only if tests pass)
- ✅ Unified CI/CD pipeline
- ✅ Automatic GitHub Pages deployment
- ✅ Free hosting with HTTPS
