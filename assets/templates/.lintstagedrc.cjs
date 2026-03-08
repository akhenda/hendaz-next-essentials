/**
 * This configuration runs file-targeted checks for staged files to keep commits fast.
 * Keep full-repo lint/typecheck in CI or pre-push hooks.
 */

const config = {
  i18nExtract: false,
  lintStagedFiles: true,
  typecheck: false,
};

function runI18nExtract() {
  return config.i18nExtract
    ? 'echo "bun run i18n:extract-and-sync"'
    : 'echo "i18n:extract is disabled"';
}

function runBiomeCheck() {
  return config.lintStagedFiles
    ? 'bunx @biomejs/biome check --write --no-errors-on-unmatched'
    : 'echo "biome check is disabled"';
}

function runTypecheck() {
  return config.typecheck ? 'bun run typecheck' : 'echo "typecheck is disabled"';
}

module.exports = {
  '*': [runI18nExtract],
  '{src,app}/**/*.{js,ts,jsx,tsx,json,jsonc,md,mdx,html,css,scss}': [runBiomeCheck()],
  '{src,app}/**/*.{ts,tsx}': [runTypecheck()],
};
