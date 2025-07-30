# Deploying the Frontend to GitHub Pages

This guide will walk you through deploying the React frontend of this application to GitHub Pages.

## 1. Install `gh-pages`

This package makes it easy to deploy to GitHub Pages.

```bash
npm install gh-pages --save-dev
```

## 2. Update `package.json`

You need to add a few things to your `package.json` file:

*   **`homepage`:**  This tells your app where it will be hosted. The format is `https://<your-github-username>.github.io/<your-repo-name>`.
*   **`predeploy` and `deploy` scripts:** These will automate the build and deployment process.

Here's how your `package.json` should look (I've added comments to highlight the new parts):

```json
{
  "name": "your-app-name",
  "version": "0.1.0",
  "private": true,
  // Add this homepage property
  "homepage": "https://<your-github-username>.github.io/<your-repo-name>",
  "dependencies": {
    // ... your dependencies
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    // Add these two scripts
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    // ... your dev dependencies
    "gh-pages": "^3.2.3"
  }
}
```

**Important:** Replace `<your-github-username>` and `<your-repo-name>` with your actual GitHub username and repository name.

## 3. Update Vite Configuration

You need to tell Vite what the base path of your application will be on GitHub Pages. Open your `vite.config.ts` file and add a `base` property:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Add this base property, using your repo name
  base: '/<your-repo-name>/',
  plugins: [react()],
})
```

**Important:** Replace `<your-repo-name>` with your repository name.

## 4. Update API URLs

In your frontend code, you are currently using `http://localhost:8000` to make API requests. You will need to change this to the URL of your deployed backend.

It's a good practice to use an environment variable for this. You can create a `.env.production` file in the root of your frontend project and add the following:

```
VITE_API_BASE_URL=https://your-deployed-backend-url.com
```

Then, in your code, you can access this variable like this:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const response = await fetch(`${apiUrl}/menu`);
```

## 5. Deploy

Once you've made these changes, you can deploy your frontend:

1.  Commit all your changes to your GitHub repository.
2.  Run the following command in your terminal:

    ```bash
    npm run deploy
    ```

This will build your application and push the contents of the `dist` directory to a new `gh-pages` branch on your repository.

## 6. Configure GitHub Pages

Finally, you need to tell GitHub to use the `gh-pages` branch for GitHub Pages:

1.  Go to your repository on GitHub.
2.  Click on the "Settings" tab.
3.  In the left sidebar, click on "Pages".
4.  Under "Source", select the `gh-pages` branch and the `/ (root)` directory.
5.  Click "Save".

It may take a few minutes for your site to be deployed. You should be able to see it at the `homepage` URL you specified in your `package.json`.
