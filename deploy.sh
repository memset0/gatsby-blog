#! /bin/bash
set -e

workdir=$(pwd)

echo "Fetch source"
cd $workdir
git pull

echo "Fetch blog-posts"
cd $workdir/content
git fetch --all
git reset --hard origin/master
git pull origin master

echo "Fetch obsidian-vault"
cd $workdir/obsidian-vault
git pull
python .github/scripts/push-to-blog.py

echo "Build with gatsby"
cd $workdir
npm ci
npm run clean
npm run build

echo "Finished."
