
const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");

const app = express();
let tasks = [];
let id = 1;

const schema = buildSchema(`
    type Task {
        id: ID!
        title: String!
        completed: Boolean!
    }

    type Query {
        getTasks: [Task]
    }

    type Mutation {
        addTask(title: String!): Task
        updateTask(id: ID!, completed: Boolean!): Task
        deleteTask(id: ID!): String
    }
`);

const root = {
    getTasks: () => tasks,

    addTask: ({ title }) => {
        const task = {
            id: String(id++),
            title,
            completed: false
        };
        tasks.push(task);
        return task;
    },

    updateTask: ({ id, completed }) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return null;

        task.completed = completed;
        return task;
    },

    deleteTask: ({ id }) => {
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) return "Task not found";

        tasks.splice(index, 1);
        return "Task deleted successfully";
    }
};

app.use("/graphql", graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}));

app.listen(5000, "0.0.0.0", () => {
    console.log("GraphQL API running on port 5000");
});