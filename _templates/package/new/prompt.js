// @ts-check

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
        packageScope: args.packageScope || 'dbx-design',
        packageRegistry: args.packageRegistry || 'https://npm.pkg.github.com'
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
        initial: args.packageScope || 'dbx-design',
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
        initial: args.packageRegistry || 'https://npm.pkg.github.com',
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