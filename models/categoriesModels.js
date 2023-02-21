const db = require("../db/connection");

exports.selectCategories = () => {
    return db.query("Select * FROM categories;").then((result) => {
        const categories = result.rows;
        return categories;
    });
};

