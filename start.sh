#!/bin/sh
set -e

echo "=== Container startup diagnostics ==="
echo "Hostname: $(hostname)"
echo "Date:     $(date -u)"
echo ""

echo "=== Environment variables present ==="
echo "DATABASE_URL set: $([ -n \"$DATABASE_URL\" ] && echo 'YES' || echo 'NO')"
echo "DIRECT_URL set:   $([ -n \"$DIRECT_URL\" ] && echo 'YES' || echo 'NO')"
echo "NODE_ENV:         ${NODE_ENV:-unset}"
echo "AZURE_AI_ENDPOINT set: $([ -n \"$AZURE_AI_ENDPOINT\" ] && echo 'YES' || echo 'NO')"
echo "AZURE_AI_KEY set:      $([ -n \"$AZURE_AI_KEY\" ] && echo 'YES' || echo 'NO')"
echo "Total env vars:   $(env | wc -l)"
echo ""

echo "=== All env var names (no values) ==="
env | cut -d= -f1 | sort
echo ""

echo "=== Running Prisma database migrations ==="
node ./node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma || {
  echo "WARNING: Migration failed (tables may already be up to date or DB not reachable)"
}

echo "=== Starting Next.js server ==="
exec node server.js
