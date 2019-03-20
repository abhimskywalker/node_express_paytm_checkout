const app = require("express")();
const port = 3000;

app.set("view engine", "pug");
app.use(require("body-parser").urlencoded({extended: false}));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
