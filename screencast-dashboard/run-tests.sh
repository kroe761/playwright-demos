#!/usr/bin/env bash
# Run the demo Playwright tests. Assumes run-servers.sh is already running
# in another terminal.

set -e
cd "$(dirname "$0")/demo-tests"
npm install --silent
npm test
