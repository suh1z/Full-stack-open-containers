const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { getAsync, setAsync}  = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  let currentValue = await getAsync('counter')
  currentValue = currentValue ? parseInt(currentValue, 10) : 0
  await setAsync('counter', currentValue + 1)
  res.send(todo);
});


router.get('/statistics', async (req, res) => {
  const amount = await getAsync('counter')
  res.json({
    "added_todos": amount || 0
  });
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo); 
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { id } = req.todo
  const todo = {
    text: req.body.text,
    done: req.body.done,
  }

  await Todo.findByIdAndUpdate(id, todo, { new: true })
    .then(todo => {
      res.json(todo)
    })
  
})

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
