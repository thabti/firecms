#!/bin/bash

echo "🚀 Starting dev server..."

# First, cleanup any existing servers
bash /Users/sabeur/Documents/work/GitHub/firecms/scripts/cleanup-dev-servers.sh

echo ""
echo "Removing Next.js cache..."
rm -rf .next

echo ""
echo "Starting fresh dev server on port 3000..."
pnpm dev
