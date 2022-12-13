const gremlin = require('gremlin');
require('dotenv').config();
// functions / definitions from gremlin js library
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;
function getNeptuneWSURL(neptuneHost, neptunePort) {
	const url = 'wss://' + neptuneHost + ':' + neptunePort + '/gremlin';
	return url;
}
// Create connection to Neptune
const dc = new DriverRemoteConnection(
	getNeptuneWSURL(process.env.DATABASE_INSTANCE, process.env.DATABASE_PORT),
	{}
);
const graph = new Graph();
const g = graph.traversal().withRemote(dc);

module.exports.hello = async (event) => {
	event.forEach(async (classe) => {
		await g.addV('Class').property('name', classe.name).next();
	});
	const result = await g.V().hasLabel('Person').toList();
	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Testing Gremlin!', data: result }),
	};
};
