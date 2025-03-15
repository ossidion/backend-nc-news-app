const app = require("./app");

const { PORT = 8080 } = process.env

app.listen(PORT, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Listening on 8080");
    }
})
