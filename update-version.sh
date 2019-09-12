#!/bin/bash
CONFIG='config/config.xml'
NEW_VERSION=${npm_package_version}

if [ -e $CONFIG ]; then
    # sed to replace version in config.xml
    sed -i '' "s/\(widget.*version=\"\)\([0-9,.]*\)\"/\1$NEW_VERSION\"/" $CONFIG
    git add $CONFIG
    echo "Updated $CONFIG with version $NEW_VERSION"
else
    echo 'Could not find config.xml'
    exit 1
fi