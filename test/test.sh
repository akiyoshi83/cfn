echo "TEST build"
node ../bin/index.js build

echo "TEST validate"
node ../bin/index.js validate

echo "TEST upload"
node ../bin/index.js upload
