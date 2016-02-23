var express = require('express');
var router = express.Router();

/*  Banco de dados*/
var mongoose = require('mongoose');
var post = mongoose.model('post');

/* Format data*/
var dateFormat = require('dateformat');

/* GET home page. */
router.get('/', function (req, res) {
    console.log("Index usuario");

    var usuario_logado = req.session.logged;
    console.log(usuario_logado);
    var error = false;

    var noticias = null;
    var maisLidas = null;


    var query_noticias = post.find().limit(5);
    var query_maisLidas = post.find().sort({numero_clicks: -1}).limit(5);


    query_noticias.exec(function (err, allNotificias) {

        if (err) {

            console.error("Error query post find: " + err);
            res.redirect('usuario/error');

        } else {
            noticias = allNotificias;

            query_maisLidas.exec(function (err, maisLidasNoticias) {
                if (err) {
                    console.error("Error query maisLidos find: " + err);
                    res.redirect('usuario/error');
                } else {
                    maisLidas = maisLidasNoticias;

                    res.render('usuario/index', {
                        title: 'Hero',
                        noticias: noticias,
                        maisLidas: maisLidas,
                        usuario: usuario_logado
                    });
                }
            });
        }
    });
});

/* GET noticia*/

router.get('/noticia/:id', function (req, res, next) {

    console.log("Click Noticia");
    var usuario_logado = req.session.logged;

    var posts = [];
    var maisLidas = null;
    var id = req.params.id;

    var query_maisLidos = post.find().sort({numero_clicks: -1}).limit(5);

    try {
        post.findOne({'_id': id}, function (err, post) {
            if (post) {

                /* Inicio salvar numero de cliques */
                var numero_clicks = post.numero_clicks + 1;
                console.log(numero_clicks);
                post.numero_clicks = numero_clicks;
                post.save();
                /* Fim alvar numero de cliques */

                console.log(post);

                posts.push(post);

                query_maisLidos.exec(function (err, maisLidasNoticias) {
                    if (err) {
                        console.error("Error query maisLidos find: " + err);
                        res.redirect('usuario/error');
                    } else {
                        maisLidas = maisLidasNoticias;

                        res.render('usuario/noticia', {
                            title: 'Hero',
                            noticias: posts,
                            maisLidas: maisLidas,
                            usuario: usuario_logado
                        });
                    }
                });

            } else {
                console.log("Notifica nao encontrada");
                res.redirect('/')
            }

        });
    } catch (err) {
        console.log("Falha ao buscar: " + err);
        res.redirect('/');
    }

});

/* POST search*/

router.post('/comentario/:id', function (req, res) {

    console.log("User Comentários");

    var id = req.params.id;

    var user = req.body.userComentario;
    console.log(user);
    var comentario = req.body.textComentario;
    console.log(comentario);

    var time = new Date();
    time = dateFormat(time, "yyyy-mm-dd h:MM:ss");

    var comments = {
        postid: id,
        name: user,
        comment: comentario,
        date: time
    };
    console.log(comments);

    try {
        post.findOne({'_id': id}, function (err, post) {
            if (post) {

                console.log(post);

                post.comments.push(comments);
                console.log(post);

                post.save(function (err) {
                    if (err) {
                        console.log('error');
                        res.redirect('noticia/' + id);
                    }
                    else {
                        console.log('success');
                        res.redirect('noticia/' + id);
                    }
                });


            } else {
                console.log("Notifica nao encontrada");
                res.redirect('noticia/' + id);
            }

        });
    } catch (err) {
        console.log("Falha ao buscar: " + err);
        res.redirect('/');
    }


});


router.post('/search', function (req, res) {

    console.log("Index search");
    var maisLidas = null;
    var srch = req.body.search_noticia;
    var usuario_logado = req.session.logged;
    console.log(new RegExp(srch));

    var query_maisLidas = post.find().sort({numero_clicks: -1}).limit(5);

    post.find({content: new RegExp(srch)}, function (err, noticias) {
        if (err) {
            console.log("Erro busca :" + noticias);
            return console.error(err);
        } else if (noticias.length != []) {

            console.log("Tudo certo" + noticias);

            query_maisLidas.exec(function (err, maisLidasNoticias) {
                if (err) {
                    console.error("Error query maisLidos find: " + err);
                    res.redirect('usuario/error');
                } else {
                    res.render('usuario/index', {
                        title: 'Hero',
                        noticias: noticias,
                        maisLidas: maisLidasNoticias,
                        usuario: usuario_logado
                    });
                }
            });
        } else {

            console.log("Vazio: " + noticias);

            query_maisLidas.exec(function (err, maisLidasNoticias) {
                if (err) {
                    console.error("Error query maisLidos find: " + err);
                    res.redirect('usuario/error');
                } else {
                    res.render('usuario/index', {
                        title: 'Hero',
                        noticias: null,
                        maisLidas: maisLidasNoticias,
                        usuario: usuario_logado
                    });
                }
            });
        }
    });

});

router.get('/gostei/:id', function (req, res) {

    console.log("Gostei notícia");

    var id = req.params.id;
    console.log(id);
    post.findOne({_id: id}, function (err, post) {
        console.log(post);
        if (!err) {
            var number_gostei = post.gostei + 1;
            post.gostei = number_gostei;
            post.save();
            console.log('Gostei ' + post.title + ' atualizado para ' + number_gostei);
            res.redirect('/');
        } else {
            console.log('Erro ao cadastrar o gostei ' + post.title);
            res.redirect('/');
        }
    });


});

router.get('/ngostei/:id', function (req, res) {

    console.log("Não gostei notícia");

    var id = req.params.id;
    console.log(id);
    post.findOne({_id: id}, function (err, post) {
        console.log(post);
        if (!err) {
            var number_ngostei = post.nao_gostei + 1;
            post.nao_gostei = number_ngostei;
            post.save();
            console.log('Gostei ' + post.title + ' atualizado para ' + number_ngostei);
            res.redirect('/');
        } else {
            console.log('Erro ao cadastrar o gostei ' + post.title);
            res.redirect('/');
        }
    });


});

router.get('/gostei_noticia/:id', function (req, res) {

    console.log("Gostei notícia");

    var id = req.params.id;
    console.log(id);
    post.findOne({_id: id}, function (err, post) {
        console.log(post);
        if (!err) {
            var number_gostei = post.gostei + 1;
            post.gostei = number_gostei;
            post.save();
            console.log('Gostei ' + post.title + ' atualizado para ' + number_gostei);
            res.redirect('/noticia/'+id);
        } else {
            console.log('Erro ao cadastrar o gostei ' + post.title);
            res.redirect('/noticia/'+id);
        }
    });


});

router.get('/ngostei_noticia/:id', function (req, res) {

    console.log("Não gostei notícia");

    var id = req.params.id;
    console.log(id);
    post.findOne({_id: id}, function (err, post) {
        console.log(post);
        if (!err) {
            var number_ngostei = post.nao_gostei + 1;
            post.nao_gostei = number_ngostei;
            post.save();
            console.log('Gostei ' + post.title + ' atualizado para ' + number_ngostei);
            res.redirect('/noticia/'+id);
        } else {
            console.log('Erro ao cadastrar o gostei ' + post.title);
            res.redirect('/noticia/'+id);
        }
    });


});


module.exports = router;
