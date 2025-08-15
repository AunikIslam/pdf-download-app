const app = require('./app');
const environmentConfig = require('./config/environment-config');

app.listen(environmentConfig.port, () => {
    console.log(`Server is running on port ${environmentConfig.port}`);
});