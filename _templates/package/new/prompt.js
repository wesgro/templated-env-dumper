// @ts-check


const DEFAULT_VALUES = /** @type {const} */ {
  packageScope: 'dbx-design',
  packageRegistry: 'https://npm.pkg.github.com'
};

/**
 * Get value from args or fallback to default
 * @template {keyof typeof DEFAULT_VALUES} T
 * @param {Record<string, string | undefined>} args
 * @param {T} key
 * @returns {string}
 */
const getValueOrDefault = (args, key) => args[key] || DEFAULT_VALUES[key];

module.exports = {
  /**
   * @param {Object} params
   * @param {import('enquirer')} params.prompter
   * @param {{ name?: string, packageScope?: string, packageRegistry?: string }} params.args
   * @returns {Promise<object>}
   */
  prompt: ({ prompter: enquirer, args }) => {
    // If name is provided via CLI, skip prompting and use defaults
    if (args.name) {
      return Promise.resolve({
        name: args.name,
        packageScope: getValueOrDefault(args, 'packageScope'),
        packageRegistry: getValueOrDefault(args, 'packageRegistry')
      });
    }

    /** @type {Parameters<import('enquirer')['prompt']>[0]} */
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your package?',
        validate: (value) => {
          if (!value.length) {
            return 'Package name is required';
          }
          // Validate package name format
          if (!/^[a-z0-9-]+$/.test(value)) {
            return 'Package name can only contain lowercase letters, numbers, and hyphens';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'packageScope',
        message: 'What packageScope should be used for the package? (without @ symbol)',
        initial: getValueOrDefault(args, 'packageScope'),
        validate: (value) => {
          if (!/^[a-z0-9-]+$/.test(value)) {
            return 'packageScope can only contain lowercase letters, numbers, and hyphens';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'packageRegistry',
        message: 'What is the package registry URL?',
        initial: getValueOrDefault(args, 'packageRegistry'),
        validate: (value) => {
          try {
            new URL(value);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      }
    ];
    return enquirer.prompt(questions);
  }
}; 