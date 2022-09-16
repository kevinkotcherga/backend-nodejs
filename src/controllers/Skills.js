const datasource = require('../utils');

module.exports = {
	//
	// ORM create
	//

	create: (req, res) => {
		const repository = datasource.getRepository('Skill');

		repository.save(req.body).then(
			() => {
				console.log('Created');
			},
			() => {
				console.log('Error');
			},
		);
		res.json({ message: 'Created' });
	},

	//
	// SQL create
	//

	// create: (req, res) => {
	// 	const repository = datasource.getRepository('Skill');

	// 	repository
	// 		.query('INSERT INTO skill(name) VALUES (?)', [req.body.name])
	// 		.then(
	// 			id => {
	// 				repository
	// 					.query('SELECT * FROM skill WHERE id=?', [id])
	// 					.then(data => {
	// 						res.json(data[0]);
	// 					});
	// 			},
	// 			err => {
	// 				console.error('Error: ', err);
	// 				res.json({ success: false });
	// 			},
	// 		);
	// },

	//
	// ORM findAll
	//

	findAll: async (req, res) => {
		const repository = datasource.getRepository('Skill');
		const skills = await repository.find({
			relations: ['upvotes', 'upvotes.wilder'],
		});
		res.json(skills);
	},

	//
	// SQL findAll
	//

	// findAll: (req, res) => {
	// 	const repository = datasource.getRepository('Skill');

	// 	repository.query('SELECT * FROM skill').then(data => {
	// 		res.json(data);
	// 	});
	// },

	//
	// ORM find
	//

	find: (req, res) => {
		const repository = datasource.getRepository('Skill');
		skillId = req.params.skillId;
		repository.findOneBy({ id: skillId }).then(
			data => {
				res.json(data);
			},
			err => {
				console.error('Error: ', err);
				res.json({ success: false });
			},
		);
	},

	//
	// SQL find
	//

	// find: (req, res) => {
	// 	const repository = datasource.getRepository('Skill');
	// 	const skillId = req.params.skillId;
	// 	repository.query('SELECT * FROM skill WHERE id=?', [skillId]).then(data => {
	// 		res.json(data);
	// 	});
	// },

	//
	// ORM update
	//

	update: async (req, res) => {
		const repository = datasource.getRepository('Skill');
		skillId = req.params.skillId;
		skillName = req.body.name;
		repository.findOneByOrFail({ id: skillId });
		const updatedSkill = await repository.save(skillName, { reload: true });
		res.json(updatedSkill);
	},

	//
	// SQL update
	//

	// update: (req, res) => {
	// 	const repository = datasource.getRepository('Skill');
	// 	const skillId = req.params.skillId;
	// 	const skillName = req.body.name;
	// 	repository
	// 		.query('UPDATE skill SET name=? WHERE id=?', [skillName, skillId])
	// 		.then(data => {
	// 			res.json(data);
	// 		});
	// },

	//
	// SQL update
	//

	delete: (req, res) => {
		const repository = datasource.getRepository('Skill');
		const skillId = req.params.skillId;
		repository.query('DELETE FROM skill WHERE id=?', [skillId]).then(data => {
			res.json(data);
		});
	},
};
