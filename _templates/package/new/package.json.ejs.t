---
to: packages/<%= name %>/package.json
---
{
  "name": "@component-scraper/<%= name %>",
  "version": "0.1.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.8.3"
  }
} 