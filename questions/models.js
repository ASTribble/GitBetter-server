const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    }
});

QuestionSchema.methods.serialize = function(){
    return {
        id: this._id,
        question: this.question,
        answer: this.answer
    }
}

const Question = mongoose.model('Question', QuestionSchema);

module.exports = {Question};

// Tauhida Parveen10:56 AM
// userSchema: questions:[question:, answer, next]

// userSchema.question.next =

// router.post(/answer)

// head = 0