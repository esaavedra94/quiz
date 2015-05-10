var models = require('../models/models.js');

/*
// GET /quizes/question
exports.question = function(req, res) {
  res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

// GET /quizes/answer
exports.answer = function(req, res) {
  if (req.query.respuesta === 'Roma') {
    res.render('quizes/answer', {respuesta: 'Correcto'});
  }
  else {
    res.render('quizes/answer', {respuesta: 'Incorrecto'});
  }
};
*/

exports.load= function(req, res, next, quizId){
  models.Quiz.find(quizId).then(
    function(quiz){
      if(quiz){
        req.quiz=quiz;
        next();
      } else{
        next (new Error ('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error) {next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  if (req.query.search === undefined) {
     models.Quiz.findAll().then(
       function(quizes) {
         res.render('quizes/index.ejs', {quizes: quizes, errors: []});
       }
     ).catch(function(error){next(error)});
   }
  else {
    req.query.search = req.query.search.replace(/ /g, "%").replace(/\+/g, "%");
    console.log(req.query.search);
    models.Quiz.findAll({where: ["pregunta like ?", "%"+req.query.search+"%"]}).then(function(quizes) {
      res.render('quizes/index.ejs', { quizes: quizes, errors: []});
    }).catch(function(error) { next(error);})
  }
};

// GET /quizes/question
exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
  res.render('quizes/show', { quiz: req.quiz });
})
};

// GET /quizes/answer
exports.answer = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    if (req.query.respuesta === req.quiz.respuesta) {
      res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Correcto'});
    }
    else {
      res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Incorrecto'});
    }
  })
};
