import app from './app.js';
import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
