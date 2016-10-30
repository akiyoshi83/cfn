echo "TEST build"
(mkdir -p ./tmp/; cd $_; node ../../bin/index.js init)
rm -rf ./tmp/

echo "TEST build"
node ../bin/index.js build

echo "TEST validate"
node ../bin/index.js validate

echo "TEST upload"
node ../bin/index.js upload

#echo "TEST create"
#node ../bin/index.js create

#echo "TEST delete"
#node ../bin/index.js delete
