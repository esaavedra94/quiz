var models = require('../models/models.js');

//GET /quizes/statistics
exports.load = function(req, res, next){
	var options = {};
	if (req.session && req.session.user) {
		options.where = {UserId:req.session.user.id}
	}
	models.Quiz.findAll().then(function(p){
		models.Comment.findAll().then(function(c){
			models.Fav.findAll(options).then(function(f){
				models.User.findAll().then(function(u){
		      var nU=u.length;
					var nC=c.length;
		      var nP=p.length;
					var nF=f.length;
					var wC=0;
		      var nnC=0;
		      var nnCp=0;
		      var cxp;
		      var idMax=0;
		      var bla=0;
		      for (var y=0; y<nC; y++) {
		        if (c[y].QuizId > idMax) idMax=c[y].QuizId;
		      }
		      for (var x=1; x<=idMax; x++) {
		        for (var z=0; z<nP; z++) {
		          cont = false;
		          if (p[z].id === x) {
		            cont = true;
		            break;
		          }
		        }
		        if (cont) {
		          for (var i=0; i<nC; i++) {
		            if (c[i].QuizId === x) {
		              nnC++;
		              if (bla != c[i].QuizId) {
		                wC++;
		                bla=c[i].QuizId;
		              }
		              if (c[i].publicado) nnCp++;
		            }
		          }
		        }
		      }
		      (nP > 0) ? cxp=(nnC/nP).toFixed(2) : cxp=0;
					res.render('quizes/statistics', {
		        preguntas: nP,
		        comentarios: nnC,
		        comentariospublicados: nnCp,
		        comentariospregunta: cxp,
		        preguntasconcomentarios: wC,
						favoritos: nF,
						usuarios: nU,
		        errors: []
		        });
				}).catch(function(error){next(error);})
			}).catch(function(error){next(error);})
		}).catch(function(error){next(error);})
	}).catch(function(error){next(error);})
};
