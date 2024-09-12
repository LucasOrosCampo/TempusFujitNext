#!/bin/bash
set -e

# If the RUNNER_TOKEN is not provided, exit
if [ -z "$RUNNER_TOKEN" ]; then
  echo "RUNNER_TOKEN not provided!"
  exit 1
fi

# GitHub Repository URL
if [ -z "$RUNNER_REPO_URL" ]; then
  echo "RUNNER_REPO_URL not provided!"
  exit 1
fi

# Configure and register the runner
./config.sh --url "${RUNNER_REPO_URL}" --token "${RUNNER_TOKEN}" --unattended --replace

# Run the runner
./run.sh
