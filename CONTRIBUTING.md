# Team Contribution Guidelines

## 1. Local Setup

1. Clone the repo and stand in the root folder.
2. Run `npm install` once (This automatically installs client, server, and root packages).
3. Duplicate `.env.example` in server, rename them to `.env`, and fill in variables.
4. To run the entire app simultaneously, run `npm run dev` from the root folder.

## 2. Development Workflow

1. Always pull the latest main branch: `git checkout main && git pull`
2. Create a branch using the correct prefix: `git checkout -b <prefix>/your-branch-name`

### Branch Naming Prefixes:

- `feat/` -> For building new user-facing features (e.g., `feat/task-feed`)
- `fix/` -> For fixing bugs or broken code (e.g., `fix/login-crash`)
- `chore/` -> For installing packages or modifying setup configs (e.g., `chore/add-axios`)
- `docs/` -> For editing markdown files or instructions (e.g., `docs/update-readme`)

3. Write code. The built-in **Biome toolchain** will automatically check, format, and lint
   your code when you commit. If you accidentally broke root dependencies,
   Git will securely block your commit until it is fixed.

## 3. Pull Requests

1. Push your branch to GitHub and open a PR against `main`.
2. Fill out the PR template details.
3. If working asynchronously, you may review your own code and click **Squash and Merge** to keep the history linear and clean.
