#!/usr/bin/env node

const { runner } = require('hygen')
const { default: Logger } = require('hygen/dist/logger')
const path = require('path')
const defaultTemplates = path.join(__dirname, '..', '_templates')

runner(['package', 'new'], {
  templates: defaultTemplates,
  cwd: process.cwd(),
  logger: new Logger(console.log.bind(console)),
  createPrompter: () => require('enquirer'),
  exec: (action, body) => {
    const opts = body && body.length > 0 ? { input: body } : {}
    return require('execa').shell(action, opts)
  },
  debug: !!process.env.DEBUG
}) 