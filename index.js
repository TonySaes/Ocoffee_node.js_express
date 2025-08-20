import express from 'express';
import 'dotenv/config';

import homeRouter from './app/routes/home.routes.js';

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', './app/views');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.use('/', homeRouter);

app.use((req, res) => {
res.status(404).render('404', { message: 'Page non trouvée', title: 'Erreur 404' });
});

app.listen(port, () => {
console.log(`Running on http://localhost:${port}`);
});