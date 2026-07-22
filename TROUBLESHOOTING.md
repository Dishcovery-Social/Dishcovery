# Troubleshooting

## CI Checks Failed

1. Go to the **Checks** tab on your PR.
2. Click the failing check to expand it.
3. Scroll to the red step to read the error output.

### Common failures

**Lint / formatting error**
Run `npm run check` from the root folder. Biome will auto-fix most issues.
Commit and push — CI will re-run automatically.

If errors remain after running `npm run check`, they require a manual fix. Common cases:

- **Unused variable or parameter** — prefix it with `_` (e.g. `_req`) to signal it is intentionally unused, or remove it if not needed.
- **SVG missing title** — add `<title>Description</title>` as the first child inside the `<svg>` element.
- **Accessibility error** — read the error message carefully; Biome will tell you which rule failed and on which line.

**Client build error**
Run `npm run build -w client` locally and read the error in your terminal.
This usually means a broken import or a missing file.

**Server syntax error**
Run `node --check server/server.ts` locally to see the exact line.

---

If you are stuck, paste the error output in the team chat.
