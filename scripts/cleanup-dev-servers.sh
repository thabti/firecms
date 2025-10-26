#!/bin/bash

echo "🧹 Cleaning up all dev servers..."

# Kill all node and pnpm processes
echo "Killing all node processes..."
killall -9 node 2>/dev/null
sleep 1

echo "Killing all pnpm processes..."
killall -9 pnpm 2>/dev/null
sleep 1

# Kill processes on specific ports
echo "Killing processes on ports 3000-3009..."
for port in {3000..3009}; do
  lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null
done

sleep 2

# Verify cleanup
RUNNING=$(ps aux | grep -E "pnpm dev|next dev" | grep -v grep | wc -l)
if [ "$RUNNING" -eq 0 ]; then
  echo "✅ All dev servers stopped successfully"
else
  echo "⚠️  Warning: $RUNNING dev server(s) still running"
  ps aux | grep -E "pnpm dev|next dev" | grep -v grep
fi

# Show port status
echo ""
echo "Port status:"
netstat -an | grep LISTEN | grep -E "300[0-9]" || echo "✅ All ports 3000-3009 are clear"
