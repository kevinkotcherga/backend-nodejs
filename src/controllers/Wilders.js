const { In } = require('typeorm');
const datasource = require('../utils');

module.exports = {
	//
	// SQL create
	//

	// create: (req, res) => {
	// 	const repository = datasource.getRepository('Wilder');

	// 	repository
	// 		.query('INSERT INTO wilder(name) VALUES (?)', [req.body.name])
	// 		.then(
	// 			id => {
	// 				repository
	// 					.query('SELECT * FROM wilder WHERE id=?', [id])
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
	// ORM create
	//

	create: (req, res) => {
		const repository = datasource.getRepository('Wilder');
		repository.save(req.body).then(
			() => {
				console.log('Created');
			},
			() => {
				console.error('Error');
			},
		);
		res.json({ message: 'Create' });
	},

	//
	// SQL findAll
	//

	// findAll: (req, res) => {
	// 	const repository = datasource.getRepository('Wilder');

	// 	repository.query('SELECT * FROM wilder').then(
	// 		data => {
	// 			res.json(data);
	// 		},
	// 		err => {
	// 			console.error('Error: ', err);
	// 			res.json({ success: false });
	// 		},
	// 	);
	// },

	//
	// ORM findAll
	//

	// findAll: (req, res) => {
	// 	const repository = datasource.getRepository('Wilder');

	// 	repository.find().then(data => {
	// 		res.json(data);
	// 	});
	// },

	findAll: (req, res) => {
		const repository = datasource.getRepository('Wilder');

		repository.find({ relations: ['upvotes', 'upvotes.skill'] }).then(data => {
			res.json(data);
		});
	},

	//
	// SQL find
	//

	// find: (req, res) => {
	// 	const repository = datasource.getRepository('Wilder');
	// 	const wilderId = req.params.wilderId;

	// 	repository.query('SELECT * FROM wilder WHERE id=?', [wilderId]).then(
	// 		data => {
	// 			res.json(data);
	// 		},
	// 		err => {
	// 			console.error('Error: ', err);
	// 			res.json({ success: false });
	// 		},
	// 	);
	// },

	//
	// ORM find
	//

	find: async (req, res) => {
		const wilderId = req.params.wilderId;

		// find 1 wilder by its ID
		const data = await datasource
			.getRepository('Wilder')
			.findOneBy({ id: wilderId })
			.then(
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
	// SQL update
	//

	// update: (req, res) => {
	// 	const repository = datasource.getRepository('Wilder');
	// 	const wilderId = req.params.wilderId;
	// 	const wilderName = req.body.name;
	// 	repository
	// 		.query('UPDATE wilder SET name=? WHERE id=?', [wilderName, wilderId])
	// 		.then(
	// 			data => {
	// 				res.json(data);
	// 			},
	// 			err => {
	// 				console.error('Error: ', err);
	// 				res.json({ success: false });
	// 			},
	// 		);
	// },

	//
	// ORM update
	//

	update: async (req, res) => {
		const wilderId = req.params.wilderId;
		const repository = datasource.getRepository('Wilder');

		const wilder = await repository.findOneByOrFail({ id: wilderId });

		wilder.name = req.body.name;
		wilder.skills = req.body.skills;

		const updatedWilder = await repository.save(wilder, { reload: true });
		res.json(updatedWilder);
	},

	//
	// SQL delete
	//

	delete: (req, res) => {
		const wilderId = req.params.wilderId;
		const repository = datasource.getRepository('Wilder');

		// raw SQL
		repository.query('DELETE FROM wilder WHERE id=?', [wilderId]).then(
			() => {
				res.json({ success: true });
			},
			err => {
				console.error('Error when removing: ', err);
				res.json({ success: false });
			},
		);

		/* // find 1 wilder by its ID
    repository.findOneBy({ id: wilderId }).then(
      (wilder) => {
        repository.remove(wilder).then(
          () => {
            res.json({ success: true });
          },
          (err) => {
            console.error("Error when removing: ", err);
            res.json({ success: false });
          }
        );
      },
      (err) => {
        console.error("Error when finding: ", err);
        res.json({ success: false });
      }
    ); */
	},
	addSkill: (req, res) => {
		const wilderId = req.params.wilderId;
		const skillId = req.body.skillId;
		const manager = datasource.manager;

		manager
			.query(
				'INSERT INTO wilder_skills_skill(wilderId, skillId) VALUES (?, ?)',
				[wilderId, skillId],
			)
			.then(
				id => {
					manager
						.query(
							`
              SELECT wilder.id AS wilderId, wilder.name AS wilderName, skill.id AS skillId, skill.name AS skillName
              FROM wilder
              LEFT JOIN wilder_skills_skill AS wss ON wss.wilderId = wilder.id
              LEFT JOIN skill ON skill.id = wss.skillId
              WHERE wilder.id=?
            `,
							[wilderId],
						)
						.then(rows => {
							// because of the left join, we got as many rows as the wilder has skills
							// we need to flatten them
							const wilder = {
								id: rows[0].wilderId,
								name: rows[0].wilderName,
								skills: rows // 1st remove all rows not related to skills, then map them to recreate skill entities
									.filter(
										row => row.skillId !== null && row.skillId !== undefined,
									)
									.map(row => ({ id: row.skillId, name: row.skillName })),
							};
							res.json(wilder);
						});
				},
				err => {
					console.error('Error: ', err);
					res.json({ success: false });
				},
			);

		/*
    datasource
      .getRepository("Wilder")
      .findOneByOrFail({ id: wilderId })
      .then((wilderToUpdate) => {
        datasource
          .getRepository("Skill")
          .findOneByOrFail({ id: skillId })
          .then((skillToInsert) => {
            wilderToUpdate.skills.push(skillToInsert);
            datasource
              .getRepository("Wilder")
              .save(wilderToUpdate)
              .then(
                (updatedWilder) => {
                  res.json(updatedWilder);
                },
                (err) => {
                  console.error("Error when saving: ", err);
                  res.json({ success: false });
                }
              );
          });
      }); */
	},
	addSkills: async (req, res) => {
		const wilderId = req.params.wilderId;
		const skillsIds = req.body.skillsIds;
		const repository = datasource.getRepository('Wilder');

		const wilder = await repository.findOneByOrFail({ id: wilderId });
		const skills = await datasource
			.getRepository('Skill')
			.find({ where: { id: In(skillsIds) } });

		wilder.skills = skills;

		const updatedWilder = await repository.save(wilder);
		res.json(updatedWilder);
	},
};
