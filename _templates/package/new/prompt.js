// @ts-check

module.exports = {
  /**
   * @param {Object} params
   * @param {import('enquirer')} params.prompter
   * @returns {Promise<object>}
   */
  prompt: ({ prompter: enquirer }) => {
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
      }
    ];
    return enquirer.prompt(questions);
  }
}; 