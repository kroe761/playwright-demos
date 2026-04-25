#!/usr/bin/env bash
# Start the relay server and the dashboard dev server together.
# Ctrl-C kills both.

set -e
cd "$(dirname "$0")"

(cd relay-server && npm start) &
RELAY=$!

(cd dashboard && npm run dev) &
DASH=$!

trap "kill $RELAY $DASH 2>/dev/null" INT TERM EXIT

echo
echo "Relay:     ws://localhost:8080"
echo "Dashboard: http://localhost:5173"
echo "Ctrl-C to stop both."
echo

wait
