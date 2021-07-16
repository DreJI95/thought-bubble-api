const router = require('express').Router();

const{
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought,
    deleteThought,
    addThoughtReaction,
    deleteThoughtReaction
} = require('../../controllers/thought-controller');

router.route('/')
.get(getAllThoughts)
.post(addThought);

router.route('/:id')
.get(getThoughtById)
.put(updateThought)
.delete(deleteThought);

router.route('/:thoughtId/reactions')
.post(addThoughtReaction)
.delete(deleteThoughtReaction);

router.route('/:thoughtId/reactions/:reactionId')
.delete(deleteThoughtReaction);

module.exports = router;