#!/usr/bin/env node
// @ts-check

const { runner } = require('hygen')
const { default: Logger } = require('hygen/dist/logger')
const path = require('path')

const defaultTemplates = path.join(__dirname, '..', '_templates')

/**
 * @typedef {import('enquirer')} Enquirer
 * @typedef {import('execa').ExecaReturnValue} ExecaReturnValue
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
    prompt: questions => enquirer.prompt(questions)
  }
}

/**
 * @param {string} action
 * @param {string | undefined} body
 * @returns {Promise<ExecaReturnValue>}
 */
const execAction = (action, body) => {
  const execa = require('execa')
  const opts = body && body.length > 0 ? { input: body } : {}
  return execa(action, { shell: true, ...opts })
}

runner(['package', 'new'], {
  templates: defaultTemplates,
  cwd: process.cwd(),
  logger: new Logger(console.log.bind(console)),
  createPrompter,
  exec: execAction,
  debug: !!process.env.DEBUG
}) 