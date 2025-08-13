# 雙峰祭オンラインシステム Client (sos24-client)

ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

雙峰祭オンラインシステム is a Next.js web application for the Sohosai festival online system at University of Tsukuba. It's built with TypeScript, uses Panda CSS for styling, Vitest for testing, Storybook for component development, and integrates with Firebase for authentication and a custom backend API.

## Working Effectively

### Bootstrap and Setup (CRITICAL: Follow exact order)
- Check Node.js version: Node.js 20.17.0+ required (verified with `node --version`)
- Install dependencies: `npm install --ignore-scripts` -- takes 2-3 minutes. NEVER CANCEL.
  - **IMPORTANT**: Use `--ignore-scripts` flag to avoid Sentry CLI download issues in sandboxed environments
  - If Sentry CLI download fails, this is expected and does not break the build
- Generate CSS system: `npm run prepare` -- takes 1-2 seconds. Runs Panda CSS codegen.
- Environment setup: Copy `.env.local.example` to `.env.local` and configure Firebase and API settings

### Build Process
- Standard build: `npm run build` -- takes 30-60 seconds. NEVER CANCEL. Set timeout to 90+ seconds.
- Cloudflare deployment build: `npx @cloudflare/next-on-pages@1` -- takes 90-120 seconds. NEVER CANCEL. Set timeout to 180+ seconds.
- **CRITICAL**: Build requires valid Firebase configuration in environment variables or will fail with `auth/invalid-api-key` errors
- Missing Sentry CLI warning is expected and does not break the build

### Testing and Quality
- Run tests: `npm run test` -- takes 1-3 seconds. 43 tests should pass.
- Lint check: `npm run lint:check` -- takes 1-3 seconds. 
- Format check: `npm run format:check` -- takes 2-4 seconds.
- **ALWAYS** run `npm run format` and `npm run lint:check` before committing or CI will fail

### Development Server
- Start dev server: `npm run dev` -- ready in 1-3 seconds
- Access at http://localhost:3000
- **Expected behavior**: Pages load with Firebase auth/API errors when backend is not running (this is normal)

### OpenAPI Schema Management  
- Generate types: `npm run gen` -- takes 1-2 seconds
- **CRITICAL**: After running `npm run gen`, ALWAYS apply these fixes due to openapi-typescript bug:
  ```bash
  sed -i '/type: "FormItem";/d' ./src/schema.d.ts
  sed -i '/type: "NewFormItem";/d' ./src/schema.d.ts
  sed -i 's/Omit<components\["schemas"\]\["FormItemKind"\], "type">/components["schemas"]["FormItemKind"]/' ./src/schema.d.ts
  ```
- Then run: `npm run format`

### Storybook Development
- Start Storybook: `npm run storybook` -- takes 10-15 seconds, accessible at http://localhost:6006
- Build Storybook: `npm run build-storybook`

## Validation Scenarios

### Manual Testing Requirements
**ALWAYS** test these scenarios after making changes:
1. **Home Page Access**: Navigate to `/` and verify the title shows "雙峰祭オンラインシステム" with environment suffix
2. **Navigation**: Test navigation to `/news`, `/forms`, `/dashboard` - pages should load (API errors expected)
3. **Build Validation**: Confirm `npm run build` completes successfully
4. **Environment Variables**: Verify app title and year display correctly based on .env.local settings

### CI/CD Validation
- **ALWAYS** run before committing:
  ```bash
  npm run format:check
  npm run lint:check
  npm run test
  ```
- The GitHub Actions CI runs: prettier check, lint check, tests with coverage
- Beta deployment to Cloudflare Pages triggers on develop branch merges

## Common Issues and Solutions

### Sentry CLI Download Failures
- **Issue**: `npm ci` or `npm install` fails with Sentry CLI download errors
- **Solution**: Use `npm install --ignore-scripts` - this is expected in sandboxed environments
- **Impact**: Sourcemap upload will be disabled but application builds and runs normally

### Firebase Configuration Errors
- **Issue**: Build fails with `Firebase: Error (auth/invalid-api-key)`
- **Solution**: Create `.env.local` with proper Firebase configuration variables (see `.env.local.example`)
- **For testing**: Use dummy values to allow build to complete

### Environment Variables
- `NEXT_PUBLIC_APP_TITLE_SUFFIX`: Adds suffix to app title (e.g., " - Dev", " - Beta")
- `NEXT_PUBLIC_APP_YEAR`: Shows year/environment below logo (e.g., "開発環境", "2025年度")
- Firebase variables: All `NEXT_PUBLIC_FIREBASE_*` variables required for build
- `NEXT_PUBLIC_API_ENDPOINT`: Backend API URL

## Project Structure

### Key Directories
- `src/app/`: Next.js App Router pages and layouts
- `src/common_components/`: Reusable UI components  
- `src/lib/`: Utility functions and API client setup
- `src/recipes/`: Panda CSS recipe definitions
- `styled-system/`: Generated Panda CSS system (do not edit manually)
- `.storybook/`: Storybook configuration
- `.github/workflows/`: CI/CD pipelines

### Important Files
- `package.json`: Dependencies and scripts
- `next.config.mjs`: Next.js configuration with Sentry and SVG handling
- `panda.config.ts`: Panda CSS configuration and theme
- `vitest.config.mts`: Test configuration
- `schema.yml`: OpenAPI schema for type generation
- `src/schema.d.ts`: Generated TypeScript types (regenerated by `npm run gen`)

### Frequently Used Commands Output
```bash
# Repository root contents
ls -la
.editorconfig .env.local.example .eslintrc.json .git .github .gitignore 
.node-version .prettierignore .prettierrc .sentryclirc.example .storybook 
.vscode @types README.md Sentry.md next.config.mjs package-lock.json 
package.json panda.config.ts postcss.config.cjs public schema.yml 
sentry.client.config.ts sentry.edge.config.ts sentry.server.config.ts 
src tsconfig.json vitest.config.mts

# Node version requirement
cat .node-version
20.17.0

# Test files location
find src -name "*.test.*"
src/common_components/Heading.test.ts
src/lib/formHelpers.test.ts  
src/lib/appTitle.test.ts
```

## Development Workflow

1. **ALWAYS** start with: `npm install --ignore-scripts` then `npm run prepare`
2. Create `.env.local` from `.env.local.example` with appropriate values
3. Test build: `npm run build` (expect 30-60 seconds)
4. Run tests: `npm run test` 
5. Start development: `npm run dev`
6. **For schema changes**: Run `npm run gen` then apply the sed fixes and `npm run format`
7. **Before committing**: Always run `npm run format` and `npm run lint:check`

## Deployment Information

- **Beta**: Auto-deploys to Cloudflare Pages on develop branch merges
- **Production**: Manual deployment via GitHub Actions
- **Build command**: `npx @cloudflare/next-on-pages@1` for Cloudflare deployment
- **Environment**: Requires Firebase and API endpoint configuration per environment
- **Monitoring**: Sentry integration for error tracking (requires proper configuration)

## Time Expectations (NEVER CANCEL)

- `npm install --ignore-scripts`: 2-3 minutes
- `npm run build`: 30-60 seconds (set timeout 90+ seconds)  
- `npx @cloudflare/next-on-pages@1`: 90-120 seconds (set timeout 180+ seconds)
- `npm run dev`: 1-3 seconds to ready
- `npm run test`: 1-3 seconds
- `npm run storybook`: 10-15 seconds
- `npm run prepare`: 1-2 seconds
- `npm run gen`: 1-2 seconds