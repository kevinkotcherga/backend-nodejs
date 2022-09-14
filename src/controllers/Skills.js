const datasource = require('../utils');

module.exports = {
	create: (req, res) => {
		const repository = datasource.getRepository('Skill');

		repository
			.query('INSERT INTO skill(name) VALUES (?)', [req.body.name])
			.then(
				id => {
					repository
						.query('SELECT * FROM skill WHERE id=?', [id])
						.then(data => {
							res.json(data[0]);
						});
				},
				err => {
					console.error('Error: ', err);
					res.json({ success: false });
				},
			);
	},
	findAll: (req, res) => {
		const repository = datasource.getRepository('Skill');

		// With SQL raw query
		repository.query('SELECT * FROM skill').then(data => {
			res.json(data);
		});
	},
	find: (req, res) => {
		const repository = datasource.getRepository('Skill');
		const skillId = req.params.skillId;
		repository.query('SELECT * FROM skill WHERE id=?', [skillId]).then(data => {
			res.json(data);
		});
	},
	update: (req, res) => {
		const repository = datasource.getRepository('Skill');
		const skillId = req.params.skillId;
		const skillName = req.body.name;
		repository
			.query('UPDATE skill SET name=? WHERE id=?', [skillName, skillId])
			.then(data => {
				res.json(data);
			});
	},
	delete: (req, res) => {
		const repository = datasource.getRepository('Skill');
		const skillId = req.params.skillId;
		repository.query('DELETE FROM skill WHERE id=?', [skillId]).then(data => {
			res.json(data);
		});
	},
};
