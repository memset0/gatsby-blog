#! /bin/bash
workdir=$(pwd)

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
npm run build

echo "Finished."
