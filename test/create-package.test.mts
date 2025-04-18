import { describe, it, expect, afterEach } from 'vitest'
import {execa} from 'execa';
import path from 'node:path'
import fs from 'node:fs/promises'
import { rimraf } from 'rimraf'
import os from 'node:os'

const TEST_PACKAGE_NAME = 'test-package'
const TMP_DIR = path.join(os.tmpdir(), `dbx-design-test-${Date.now()}`)
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

  it('should create a new package with the correct structure', async () => {
    const scriptPath = path.resolve(__dirname, '../bin/create-component-package.js')

    await execa({
      input: TEST_PACKAGE_NAME + '\n', // Simulate user input
      encoding: 'utf8',
      cwd: TMP_DIR
    })`node ${scriptPath}`
    

    // Verify the package directory was created
    const packageDirExists = await fs.stat(TEST_PACKAGE_DIR)
      .then(() => true)
      .catch(() => false)
    expect(packageDirExists).toBe(true)

    // Verify package.json was created with correct name
    const packageJson = JSON.parse(
      await fs.readFile(path.join(TEST_PACKAGE_DIR, 'package.json'), 'utf-8')
    ) as PackageJson
    
    expect(packageJson.name).toContain(TEST_PACKAGE_NAME)
    expect(packageJson.private).toBe(true)

    // Run npm test in the temp directory
    await execa({
      cwd: TEST_PACKAGE_DIR,
      preferLocal: true,
      shell: true
    })`npm i --ignore-scripts`
    // verify a package-lock.json was created
    const packageLockExists = await fs.stat(path.join(TEST_PACKAGE_DIR, 'package-lock.json'))
      .then(() => true)
      .catch(() => false)
    expect(packageLockExists).toBe(true)
   
    

  }, 50000)
}) 