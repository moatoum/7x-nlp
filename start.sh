#!/bin/sh
set -e

echo "=== Running Prisma database migrations ==="
node ./node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma || {
  echo "WARNING: Migration failed (tables may already be up to date or DB not reachable)"
}

echo "=== Starting Next.js server ==="
exec node server.js
