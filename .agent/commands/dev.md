# Development Server Command

## Running Locally

To start the Next.js development server with Turbopack:

```bash
npm run dev
```

- **Default URL**: `http://localhost:3000`
- **Turbopack**: Enabled by default in Next.js 16. Fast HMR and sub-second startup.

## Troubleshooting

- **Port in use (3000)**:
  Find and kill the blocking process:
  ```powershell
  Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object OwningProcess
  Stop-Process -Id <PID> -Force
  ```
- **Clearing cache**:
  If stale builds occur, delete `.next/`:
  ```powershell
  Remove-Item -Recurse -Force .next
  ```
