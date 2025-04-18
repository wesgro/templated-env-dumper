import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import {execa} from 'execa';
import path from 'node:path'
import fs from 'node:fs/promises'
import { rimraf } from 'rimraf'
import os from 'node:os'
import crypto from 'node:crypto'

const TEST_PACKAGE_NAME = 'test-package'
const TMP_DIR = path.join(os.tmpdir(), `dbx-design-test-${Date.now()}-${crypto.randomUUID()}`)
const PACKAGES_DIR = path.join(TMP_DIR, 'packages')
const TEST_PACKAGE_DIR = path.join(PACKAGES_DIR, TEST_PACKAGE_NAME)

interface PackageJson {
  name: string
  version: string
  private: boolean
  main: string
  types: string
  scripts: {
    build: string
    test: string
    lint: string
  }
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

describe('create-component-package', () => {
  beforeEach(async () => {
    await fs.mkdir(PACKAGES_DIR, { recursive: true })
  })

  afterEach(async () => {
    // Clean up the temp directory after each test
    await rimraf(TMP_DIR)
  })

  it('should create a new package with the correct structure and default npmrc values', async () => {
    const scriptPath = path.resolve(__dirname, '../bin/create-component-package.js')

    await execa({
      encoding: 'utf8',
      cwd: TMP_DIR
    })`node ${scriptPath} --name ${TEST_PACKAGE_NAME}`
    
    // Verify the package directory was created
    const packageDirExists = await fs.stat(TEST_PACKAGE_DIR)
      .then(() => true)
      .catch(() => false)
    expect(packageDirExists).toBe(true)

    // Verify that `src` directory was created
    const srcDirExists = await fs.stat(path.join(TEST_PACKAGE_DIR, 'src'))
      .then(() => true)
      .catch(() => false)
    expect(srcDirExists).toBe(true)

    // Verify that `src/main.tsx` file was created
    const mainFileExists = await fs.stat(path.join(TEST_PACKAGE_DIR, 'src/main.tsx'))
      .then(() => true)
      .catch(() => false)
    expect(mainFileExists).toBe(true)
    
    // Verify package.json was created with correct name
    const packageJson = JSON.parse(
      await fs.readFile(path.join(TEST_PACKAGE_DIR, 'package.json'), 'utf-8')
    ) as PackageJson
    
    expect(packageJson.name).toContain(TEST_PACKAGE_NAME)
    expect(packageJson.private).toBe(true)

    // Verify .npmrc was created with default values
    const npmrcContent = await fs.readFile(path.join(TEST_PACKAGE_DIR, '.npmrc'), 'utf-8')
    expect(npmrcContent.trim()).toBe('@dbx-design:registry=https://npm.pkg.github.com')

    // Run npm test to verify the package.json is at least valid
    await execa({
      cwd: TEST_PACKAGE_DIR,
      preferLocal: true,
      shell: true
    })`npm run test`
  }, 5000)

  it('should create a new package with custom scope and registry in npmrc', async () => {
    const scriptPath = path.resolve(__dirname, '../bin/create-component-package.js')
    const customScope = 'my-scope'
    const customRegistry = 'https://custom.registry.com'

    await execa({
      encoding: 'utf8',
      cwd: TMP_DIR
    })`node ${scriptPath} --name ${TEST_PACKAGE_NAME} --packageScope ${customScope} --packageRegistry ${customRegistry}`

    // Verify the package directory was created
    const packageDirExists = await fs.stat(TEST_PACKAGE_DIR)
      .then(() => true)
      .catch(() => false)
    expect(packageDirExists).toBe(true)

    // Verify .npmrc was created with custom values
    const npmrcContent = await fs.readFile(path.join(TEST_PACKAGE_DIR, '.npmrc'), 'utf-8')
    expect(npmrcContent.trim()).toBe(`@${customScope}:registry=${customRegistry}`)

    // Run npm test to verify the package.json is at least valid
    await execa({
      cwd: TEST_PACKAGE_DIR,
      preferLocal: true,
      shell: true
    })`npm run test`
  }, 5000)
}) 