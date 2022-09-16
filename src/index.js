const express = require('express');
const cors = require('cors');
const datasource = require('./utils');
const wildersController = require('./controllers/Wilders');
const skillsController = require('./controllers/Skills');
const upvotesController = require('./controllers/Upvotes');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello you!');
});

// High order function = function that returns a function
const asyncHandler = controller => {
	return async function (req, res) {
		try {
			await controller(req, res);
		} catch (err) {
			console.error('Error: ', err);
			res.status(500).json({ error: err.message || 'Error occured' });
		}
	};
};

// Pur function, same input = same output
function sum(a, b) {
	return a + b;
}

/**
 * Wilders Routes
 */
app.post('/api/wilders', wildersController.create);
app.get('/api/wilders', wildersController.findAll);
app.get('/api/wilders/:wilderId', asyncHandler(wildersController.find));
app.put('/api/wilders/:wilderId', asyncHandler(wildersController.update));
app.delete('/api/wilders/:wilderId', wildersController.delete);
app.post('/api/wilders/:wilderId/skills', wildersController.addSkill);
// app.post(
//   "/api/wilders/:wilderId/skills",
//   asyncHandler(wildersController.addSkills)
// );

/**
 * Skills Routes
 */
app.get('/api/skills', skillsController.findAll);
app.get('/api/skills/:skillId', skillsController.find);
app.post('/api/skills', skillsController.create);
app.put('/api/skills/:skillId', skillsController.update);
app.delete('/api/skills/:skillId', skillsController.delete);

/**
 * Upvotes Routes
 */
app.post('/api/upvotes', asyncHandler(upvotesController.create));
app.put(
	'/api/upvotes/:upvoteId/upvote',
	asyncHandler(upvotesController.upvote),
);

app.listen(5000, async () => {
	console.log('Server started, youpi!');

	/**
	 * datasource.initialize()
	 *  .then(() => console.log("I'm connected!"))
	 *  .catch(() => console.log("Dommage"))
	 */

	try {
		await datasource.initialize();
		console.log("I'm connected!");
	} catch (err) {
		console.log('Dommage');
		console.error(err);
	}
});

// 2 bonuses
// → add upvotes to wilder skill
// → uploaded un avatar, package → multer
