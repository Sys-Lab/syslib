node build.js --standard --compress --no_warning
cp build/SYSLIB.min.js dl/standard/
node build.js --mini --compress --no_warning
cp build/SYSLIB.min.js dl/mini/
node build.js --full --compress --no_warning
cp build/SYSLIB.min.js dl/full/