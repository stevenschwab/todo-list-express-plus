const Todo = require('../models/Todo')

module.exports = {
    getTodos: async (req, res) => {
        console.log(req.user)
        try {
            const todoItems = await Todo.find(
                { 
                    microsoftId: req.user.microsoftId 
                }
            ) //talking to the db, mongoose returns an array of objects
            const itemsLeft = await Todo.countDocuments(
                {
                    microsoftId: req.user.microsoftId,
                    completed: false
                }
            ) //talking to the db
            res.render('todos.ejs', {
                todos: todoItems, 
                left: itemsLeft, 
                user: req.user
            }) //tells ejs to render and responds with html
        } catch(err) {
            console.log(err)
        }
    },
    createTodo: async (req, res) => {
        try {
            await Todo.create(
                {
                    todo: req.body.todoItem, 
                    completed: false, 
                    microsoftId: req.user.microsoftId
                }
            )
            console.log('Todo has been added!')
            res.redirect('/todos') //reloaded and made a get request
        } catch(err) {
            console.log(err)
        }
    },
    markComplete: async (req, res) => {
        try {
            await Todo.findOneAndUpdate(
                {
                    _id: req.body.todoIdFromJSFile
                },
                {
                    completed: true
                }
            )
            console.log('Marked Complete')
            res.json('Marked Complete')
        } catch(err) {
            console.log(err)
        }
    },
    markIncomplete: async (req, res) => {
        try {
            await Todo.findOneAndUpdate(
                {
                    _id: req.body.todoIdFromJSFile
                },
                {
                    completed: false
                }
            )
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        } catch(err) {
            console.log(err)
        }
    },
    deleteTodo: async (req, res) => {
        console.log(req.body.todoIdFromJSFile)
        try {
            await Todo.findOneAndDelete(
                {
                    _id: req.body.todoIdFromJSFile
                }
            )
            console.log('Deleted Todo')
            res.json('Deleted It')
        } catch(err) {
            console.log(err)
        }
    }
}