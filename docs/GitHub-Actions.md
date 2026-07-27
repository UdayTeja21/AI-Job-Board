# GitHub Actions CI/CD Documentation

Continuous Integration and Continuous Deployment (CI/CD) is essential for maintaining code quality and ensuring that new features do not break existing functionality. The AI Job Board utilizes **GitHub Actions** to automate this pipeline.

---

## 🎯 Purpose of CI/CD

1. **Quality Assurance**: Automatically catch syntax errors, linting issues, and failing tests before code is merged into the main branch.
2. **Deployment Safety**: Ensure that only code which successfully builds is pushed to production environments (Vercel/Render).
3. **Developer Velocity**: Eliminate manual deployment steps, allowing engineers to focus on writing code rather than managing server uploads.

---

## 🛤 The Workflow

A YAML configuration file (located in `.github/workflows/main.yml`) defines the automated pipeline. This workflow is triggered on:
- `push` events to the `dev` and `main` branches.
- `pull_request` events targeting the `dev` and `main` branches.

### Pipeline Stages

#### 1. Setup & Caching
- The GitHub Actions runner checks out the repository code.
- It sets up a Node.js environment (e.g., Node v20).
- It caches `node_modules` based on the `package-lock.json` hash. If dependencies haven't changed, the runner restores them from cache, saving significant time during the build process.

#### 2. Validation (Linting)
- The runner executes `npm run lint` (using Oxlint or ESLint) in the frontend directory.
- This catches unused variables, accessibility violations, and syntax errors. If the linter fails, the pipeline halts immediately, preventing bad code from proceeding.

#### 3. Build Process (Frontend)
- The runner navigates to the `/frontend` directory and executes `npm run build`.
- Vite compiles the React JSX, tree-shakes the dependencies, processes Tailwind CSS, and outputs static assets to the `dist/` folder.
- If the build fails (e.g., due to a missing import or strict type error), the pipeline halts.

#### 4. Automatic Deployment
The pipeline currently contains a deployment stub that verifies the build succeeds on the `dev` or `main` branches. 

Because Vercel and Render are connected directly to the GitHub repository, once the GitHub Actions pipeline passes on the `main` branch, the cloud providers automatically initiate their own deployment pulls. Alternatively, deployment webhooks can be easily injected into the existing CI/CD stub.

---

## 🌟 Benefits to the Engineering Team

- **Confidence**: Developers can merge Pull Requests knowing the codebase compiles and passes static analysis.
- **Traceability**: Every commit has a green checkmark (✅) or red cross (❌) next to it, making it easy to identify exactly which commit introduced a breaking change.
- **Consistency**: The build environment is identical every single time, eliminating the "it works on my machine" problem.
