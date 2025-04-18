#!/usr/bin/env node
// @ts-check

const { runner } = require('hygen')
const { default: Logger } = require('hygen/dist/logger')
const path = require('path')

const defaultTemplates = path.join(__dirname, '..', '_templates')

/**
 * @typedef {import('enquirer')} Enquirer
 * @typedef {ReturnType<typeof import('execa').execa>} ExecaResult
 */

/**
 * @template T
 * @typedef {Object} Prompter
 * @property {(questions: any) => Promise<T>} prompt
 */

/**
 * @template Q,T
 * @returns {Prompter<T>}
 */
const createPrompter = () => {
  const enquirer = require('enquirer')
  return {
    prompt: questions => {
      return enquirer.prompt(questions)
    }
  }
}

/**
 * @param {string} action
 * @param {string | undefined} body
 * @returns {ExecaResult}
 */
const execAction = (action, body) => {
  const { execa } = require('execa')
  const opts = body && body.length > 0 ? { input: body } : {}
  return execa(action, { shell: true, ...opts })
}

// Get any additional flags passed to the script
const args = process.argv.slice(2)
runner(['package', 'new', ...args], {
  templates: defaultTemplates,
  cwd: process.cwd(),
  logger: new Logger(console.log.bind(console)),
  createPrompter,
  exec: execAction,
  debug: !!process.env.DEBUG
}) 