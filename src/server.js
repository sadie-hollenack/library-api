import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());


app.use(morgan('tiny'));

app.use(express.json());

const docSpecs = YAML.load('docs/public/bundled.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docSpecs));

// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    console.log(err.stack);
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: err.message });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
