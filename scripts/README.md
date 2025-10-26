# Development Scripts

## Problem
During development, multiple Next.js dev servers can get stuck running on different ports (3000, 3001, 3002, etc.), causing confusion and showing old cached versions of your code.

## Solution
These scripts ensure you always have a clean, single dev server running.

## Usage

### Start Development Server (Recommended)
```bash
pnpm dev
```
This will:
1. Kill ALL existing dev servers on ports 3000-3009
2. Clear the Next.js `.next` cache
3. Start a fresh dev server on port 3000

### Clean Up Only (Without Starting)
```bash
pnpm clean
```
This kills all dev servers but doesn't start a new one.

### Manual Cleanup
```bash
bash scripts/cleanup-dev-servers.sh
```

### Unsafe Mode (Not Recommended)
```bash
pnpm dev:unsafe
```
Starts dev server WITHOUT cleanup (old behavior - may cause issues).

## What This Prevents

✅ Multiple dev servers running simultaneously
✅ Servers running on wrong ports (3001, 3002, etc.)
✅ Stale cached code being served
✅ Browser showing old versions of your app

## How to Avoid This Issue in the Future

1. **Always use `pnpm dev`** instead of manually running `next dev`
2. When stopping the server, use `Ctrl+C` in the terminal
3. If you see old code, run `pnpm clean` then `pnpm dev`
4. **Hard refresh** your browser after restarting: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)

## Troubleshooting

If you still see old code:
1. Run `pnpm clean`
2. Close ALL browser tabs with localhost:3000
3. Run `pnpm dev`
4. Open a fresh browser tab
5. Hard refresh the page
