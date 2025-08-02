#!/bin/bash
cd /home/kavia/workspace/code-generation/culturepulse-insights-22461-17886/culture_pulse_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

