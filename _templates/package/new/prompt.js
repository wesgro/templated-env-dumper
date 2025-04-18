// @ts-check
const { z } = require('zod');

const DEFAULT_VALUES = /** @type {const} */ {
  packageScope: 'dbx-design',
  packageRegistry: 'https://npm.pkg.github.com'
};

const packageNameSchema = z.string()
  .min(1, 'Package name is required')
  .regex(/^[a-z0-9-]+$/, 'Package name can only contain lowercase letters, numbers, and hyphens');

const packageScopeSchema = z.string()
  .regex(/^[a-z0-9-]+$/, 'Package scope can only contain lowercase letters, numbers, and hyphens');

const packageRegistrySchema = z.string()
  .url('Package registry must be a valid URL');

const packageSchema = z.object({
  name: packageNameSchema,
  packageScope: packageScopeSchema,
  packageRegistry: packageRegistrySchema
});

/**
 * Get value from args or fallback to default
 * @template {keyof typeof DEFAULT_VALUES} T
 * @param {Record<string, string | undefined>} args
 * @param {T} key
 * @returns {string}
 */
const getValueOrDefault = (args, key) => args[key] || DEFAULT_VALUES[key];

/**
 * Validate a single value with a zod schema
 * @template T
 * @param {z.ZodType<T>} schema
 * @param {unknown} value
 * @returns {string | true}
 */
const validateWithZod = (schema, value) => {
  const result = schema.safeParse(value);
  if (!result.success) {
    return result.error.errors[0].message;
  }
  return true;
};

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
      const values = {
        name: args.name,
        packageScope: getValueOrDefault(args, 'packageScope'),
        packageRegistry: getValueOrDefault(args, 'packageRegistry')
      };

      // Validate all values
      const result = packageSchema.safeParse(values);
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }

      return Promise.resolve(values);
    }

    /** @type {Parameters<import('enquirer')['prompt']>[0]} */
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your package?',
        validate: (value) => validateWithZod(packageNameSchema, value)
      },
      {
        type: 'input',
        name: 'packageScope',
        message: 'What packageScope should be used for the package? (without @ symbol)',
        initial: getValueOrDefault(args, 'packageScope'),
        validate: (value) => validateWithZod(packageScopeSchema, value)
      },
      {
        type: 'input',
        name: 'packageRegistry',
        message: 'What is the package registry URL?',
        initial: getValueOrDefault(args, 'packageRegistry'),
        validate: (value) => validateWithZod(packageRegistrySchema, value)
      }
    ];

    return enquirer.prompt(questions).then((answers) => {
      // Double check all answers with zod
      const result = packageSchema.safeParse(answers);
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
      return answers;
    });
  }
}; 