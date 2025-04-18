module.exports = {
  prompt: ({ inquirer }) => {
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
    return inquirer.prompt(questions);
  }
}; 