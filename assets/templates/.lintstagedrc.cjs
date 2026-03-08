/**
 * This configuration is for lint-staged, which runs specified commands on staged files before committing.
 * It is used to ensure code quality and consistency by running tasks like formatting, linting,
 * and type checking on files that are about to be committed.
 *
 * NOTE: Some of the commands are disabled to allow users to commit changes that are WIP or not.
 *
 * Enable or disable commands as needed based on your project's requirements.
 */

const config = {
  i18nEtract: false,
  lintRepo: true,
  typecheck: false,

  /**
   * Format, sort imports, lint, and apply safe fixes
   * https://biomejs.dev/recipes/git-hooks/#husky
   */
  format: true,
};

function runI18nExtract() {
  return config.i18nEtract
    ? 'echo "bun run i18n:extract-and-sync"'
    : 'echo "i18n:extract is disabled"';
}

function runLint() {
  return config.lintRepo ? 'bun run lint' : 'echo "lint is disabled"';
}

function runTypecheck() {
  return config.typecheck ? 'bun run typecheck' : ' echo "typecheck is disabled"';
}

function runFormat() {
  return config.format ? 'bun run format' : 'echo "format is disabled"';
}

module.exports = {
  // NOTE: runTypecheck is disabled globally because running it on only staged files resets the file and deletes other tems
  '*': [runI18nExtract, runLint],
  '{src,app}/**/*.{ts,tsx}': runTypecheck(),
  '{src,app}/**/*.{js,ts,jsx,tsx,json,jsonc,md,mdx,html,css,scss}': [runFormat()],
};
