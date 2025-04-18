---
to: packages/<%= name %>/tsconfig.json
---
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
} 