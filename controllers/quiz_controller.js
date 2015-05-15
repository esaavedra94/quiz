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

// Autoload, factoriza el código si ruta incluye :quizId
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
    req.query.search = req.query.search.replace(/\s+/g, "%").replace(/\++/g, "%");
    console.log(req.query.search);
    models.Quiz.findAll({where: ["pregunta like ?", "%"+req.query.search+"%"], order: 'pregunta ASC'}).then(function(quizes) {
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

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render(
    'quizes/answer',
    { quiz: req.quiz,
      respuesta: resultado
    }
  );
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
// guarda en DB los campos pregunta y respuesta de quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');
  })   // res.redirect: Redirección HTTP a lista de preguntas
};
