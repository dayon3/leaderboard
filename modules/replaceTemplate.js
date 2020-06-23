module.exports = (temp, user) => {
	let output = temp.replace(/{%NUMBER%}/g, user.id);
	output = output.replace(/{%FULLNAME%}/g, user.name);
	output = output.replace(/{%USERNAME%}/g, user.username);
	output = output.replace(/{%EMAIL%}/g, user.email);
	output = output.replace(/{%POINTS%}/g, user.points);
	return output;
};
