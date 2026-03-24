# Claude Code Rules

## Git

- Never commit directly to `main`. Always create a feature branch and open a PR.
- Branch naming: `feat/`, `fix/`, `chore/` prefixes (e.g. `feat/subdomain-support`)
- Use `npm run release:patch` or `npm run release:minor` to release — never bump versions manually
