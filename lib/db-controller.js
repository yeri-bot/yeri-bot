const { MongoClient } = require('mongodb');

class DbController {
    constructor() {
        this.db = {
            macros: null,
            ops: null
        };
    }

    connect(credentials) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(`mongodb://${credentials.user}:${credentials.password}@${credentials.host}/${credentials.db}`, { useNewUrlParser: true })
            .then((client) => {
                let database = client.db(credentials.db);

                this.db = {
                    macros: database.collection('macros'),
                    ops: database.collection('ops')
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

    addMacro(name, content, author, guild) {
        return this.db.macros.insertOne({ name, content, author, guild });
    }

    setMacro(name, content, guild) {
        return this.db.macros.updateOne({ name, guild }, { $set: { content } });
    }

    removeMacro(name, guild) {
        return this.db.macros.deleteOne({ name, guild });
    }

    getOperators() {
        return this.db.ops.find({}).toArray();
    }

    setOperators(operators) {
        return new Promise((resolve, reject) => {
            this.db.ops.drop()
            .then(() => {
                this.db.ops.insertMany(operators)
                .then(() => resolve());
            })
            .catch((reason) => reject(reason));
        });
    }

    addOperator(user, guild) {
        return this.db.ops.insertOne({ user, guild });
    }

    removeOperator(user, guild) {
        return this.db.ops.deleteOne({ user, guild });
    }
}

module.exports = DbController;