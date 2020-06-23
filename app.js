const fs = require('fs');
const http = require('http');
const axios = require('axios');

const replaceTemplate = require('./modules/replaceTemplate');
const sortList = require('./modules/sortList');

//SERVER
const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	'utf-8'
);
const tempUser = fs.readFileSync(
	`${__dirname}/templates/template-user.html`,
	'utf-8'
);

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
	console.log(req.url);
	const pathName = req.url;

	// Overview page
	if (pathName === '/' || pathName === '/overview') {
		res.writeHead(200, { 'Content-type': 'text/html' });

		const sortedData = dataObj.sort(sortList);
		for (let index = 0; index < sortedData.length; index++) {
			const element = sortedData[index];
			element['id'] = index + 1;
		}
		const userHtml = sortedData
			.map((el) => replaceTemplate(tempUser, el))
			.join('');
		const output = tempOverview.replace(/{%USERLIST%}/g, userHtml);
		res.end(output);

		// API
	} else if (pathName === '/api') {
		res.writeHead(200, { 'Content-type': 'application/json' });
		const readable = fs.createReadStream(`${__dirname}/data/data.json`);
		readable.pipe(res);

		// Not found
	} else {
		res.writeHead(404, {
			'Content-type': 'text/html',
		});
		res.end('<h1>Page not found!</h1>');
	}
});

server.listen(3000, 'localhost', () => {
	console.log('Listening to requests on port 3000...');
});
