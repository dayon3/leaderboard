const fs = require('fs');
const express = require('express');
const fetch = require('node-fetch');

const replaceTemplate = require('./modules/replaceTemplate');
const sortList = require('./modules/sortList');

const app = express();

// MIDDLEWARE
console.log(process.env.NODE_ENV);
app.use(express.static(`${__dirname}/public`));
const tempOverview = fs.readFileSync(
	`${__dirname}/public/templates/template-overview.html`,
	'utf-8'
);
const tempUser = fs.readFileSync(
	`${__dirname}/public/templates/template-user.html`,
	'utf-8'
);

let url =
	'https://gist.githubusercontent.com/dayon3/60ec6c15668f74c056b11ec26dc51629/raw/90003c5b69f4f704e0eb310668fcc86d3ab996f1/user-data.json';
let data;
(async () => {
	const response = await fetch(url);
	const json = await response.json();

	data = json;
})();

app.get('/', (req, res) => {
	const sortedData = data.sort(sortList);
	for (let index = 0; index < sortedData.length; index++) {
		const element = sortedData[index];
		element['id'] = index + 1;
	}
	const userHtml = sortedData
		.map((el) => replaceTemplate(tempUser, el))
		.join('');
	const output = tempOverview.replace(/{%USERLIST%}/g, userHtml);
	res.send(output);
});

app.get('/api/v1/users', (req, res) => {
	res.json(data);
});

module.exports = app;
