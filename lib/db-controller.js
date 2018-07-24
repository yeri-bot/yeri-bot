const { MongoClient } = require('mongodb');

class DbController {
    constructor() {
        this.db = {};
    }

    connect(credentials) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(`mongodb://${credentials.user}:${credentials.password}@${credentials.host}/${credentials.db}`, { useNewUrlParser: true })
            .then((client) => {
                let database = client.db(credentials.db);

                this.db = {
                    macros: database.collection('macros')
                };

                resolve();
            })
            .catch((reason) => reject(reason));
        });
    }

    getMacros() {
        return this.db.macros.find({}).toArray();
    }

    setMacros(macros) {
        return new Promise((resolve, reject) => {
            this.db.macros.drop()
            .then(() => {
                this.db.macros.insertMany(macros)
                .then(() => resolve());
            })
            .catch((reason) => reject(reason));
        });
    }

    addMacro(name, content, author) {
        return this.db.macros.insertOne({ name, content, author });
    }

    setMacro(name, content) {
        return this.db.macros.updateOne({ name }, { $set: { content } });
    }

    removeMacro(name) {
        return this.db.macros.deleteOne({ name });
    }
}

module.exports = DbController;