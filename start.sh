#!/bin/bash

echo "🚀 Starting Nexus Fluent in production mode..."

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "📦 Building application..."
    npm run build
fi

echo "✅ Starting server..."
npm run serve
