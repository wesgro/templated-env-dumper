---
to: packages/<%= name %>/package.json
---
{
  "name": "@dbx-design/<%= name %>",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "echo 'test'"
  },
  "dependencies": {},
  "devDependencies": {
    "vite": "^6",
    "@vitejs/plugin-react-swc": "^3",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "~5"
  }
} 