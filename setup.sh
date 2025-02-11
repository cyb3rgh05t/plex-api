#!/bin/bash

# Create project directories
mkdir -p src/app/{api/{activities,config},components,config,hooks,lib}
mkdir -p src/data

# Create initial format-config.json
echo '{
  "variables": ["title", "subtitle", "progress", "type"],
  "outputFormat": "{title} - {subtitle} ({progress}%)"
}' > src/data/format-config.json

# Create empty .env file
echo 'PLEX_TOKEN=your_plex_token_here
PLEX_SERVER=http://your_plex_server:32400' > .env

# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Install dependencies
npm install

echo "Project structure created successfully!"