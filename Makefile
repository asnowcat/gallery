build: .babelrc
	npx babel app.jsx -o public/app.js

babelrc: .babelrc
	echo -e '{ "presets": ["@babel/preset-react"] }' > .babelrc