var express = require('express');
var router = express.Router();
var async = require('async');
/*  Banco de dados*/
var mongoose = require('mongoose');
var post = mongoose.model('post');
var categoria = mongoose.model('categoria');
/* Format data*/
var dateFormat = require('dateformat');


/* GET home page. */
router.get('/', function (req, res) {
    console.log("Index usuario");

    var usuario_logado = req.session.logged;
    console.log(usuario_logado);
    var result;
    try {
        async.parallel([
                // Find all notícias
                function (callback) {
                    var query = post.find().limit(5);
                    query.exec(function (err, noticias) {
                        if (err) {
                            callback(err);
                        }

                        callback(null, noticias);
                    });
                },

                //Find all categorias
                function (callback) {
                    var query = categoria.find();
                    query.exec(function (err, categoria) {
                        if (err) {
                            callback(err);
                        }

                        callback(null, categoria);
                    });
                },

                //Find all mais lidos
                function (callback) {
                    var query = post.find().sort({numero_clicks: -1}).limit(5);
                    query.exec(function (err, noticiasMaisLidas) {
                        if (err) {
                            callback(err);
                        }
                        callback(null, noticiasMaisLidas);
                    });
                }
            ],
            //Compute all results
            function (err, results) {
                if (err) {
                    console.log(err);
                    return null;
                }

                if (results == null || results[0] == null) {
                    return null;
                }

                res.render('usuario/index', {
                    title: 'Hero',
                    noticias: results[0],
                    categorias: results[1],
                    maisLidas: results[2],
                    noticiaBanner: results[2].slice(0, 3),
                    usuario: usuario_logado
                });
            });
    } catch (err) {
        console.log("Falha ao abrir : " + err);
        res.redirect('/usuario/error');
    }

});

/* GET noticia*/

router.get('/noticia/:id', function (req, res, next) {

    console.log("Click Noticia");
    var usuario_logado = req.session.logged;

    var posts = [];
    var maisLidas = null;
    var id = req.params.id;

    try {

        async.parallel([
                // Find all notícias
                function (callback) {
                    var query = post.findOne({'_id': id});
                    query.exec(function (err, noticia) {
                        if (err) {
                            callback(err);
                        }

                        //Atualiza numero de clicks
                        noticia.numero_clicks = noticia.numero_clicks + 1;
                        console.log(noticia.numero_clicks);
                        noticia.save();

                        callback(null, noticia);
                    });
                },

                //Find all categorias
                function (callback) {
                    var query = categoria.find();
                    query.exec(function (err, categoria) {
                        if (err) {
                            callback(err);
                        }

                        callback(null, categoria);
                    });
                },

                //Find all mais lidos
                function (callback) {
                    var query = post.find().sort({numero_clicks: -1}).limit(5);
                    query.exec(function (err, noticiasMaisLidas) {
                        if (err) {
                            callback(err);
                        }
                        callback(null, noticiasMaisLidas);
                    });
                }
            ],

            //Compute all results
            function (err, results) {
                if (err) {
                    console.log(err);
                    console.log("Notifica nao encontrada");
                    res.redirect('/');
                }

                if (results == null || results[0] == null) {
                    console.log("Notifica nao encontrada");
                    res.redirect('/');
                }

                posts.push(results[0]);

                res.render('usuario/noticia', {
                    title: 'Hero',
                    noticias: posts,
                    categorias: results[1],
                    maisLidas: results[2],
                    usuario: usuario_logado
                });
            });

    } catch (err) {
        console.log("Falha ao buscar: " + err);
        res.redirect('/');
    }

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
            res.redirect('/noticia/' + id);
        } else {
            console.log('Erro ao cadastrar o gostei ' + post.title);
            res.redirect('/noticia/' + id);
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
            res.redirect('/noticia/' + id);
        } else {
            console.log('Erro ao cadastrar o gostei ' + post.title);
            res.redirect('/noticia/' + id);
        }
    });


});

router.get('/categoria/:id', function (req, res) {

    console.log("Filtrar categoria");

    var usuario_logado = req.session.logged;
    console.log(usuario_logado);

    var id = req.params.id;

    var queryC = categoria.findOne({_id: id});
    try {
        queryC.exec(function (err, categorias) {
            if (err) {
                console.log(err);
                res.redirect('/usuario/error');
            }
            var nomeCategoria = categorias.nome_categoria;
            async.parallel([
                    // Find all notícias
                    function (callback) {
                        var query = post.find({category: nomeCategoria}).limit(5);
                        query.exec(function (err, noticias) {
                            if (err) {
                                callback(err);
                            }

                            callback(null, noticias);
                        });
                    },

                    //Find all categorias
                    function (callback) {
                        var query = categoria.find();
                        query.exec(function (err, categoria) {
                            if (err) {
                                callback(err);
                            }

                            callback(null, categoria);
                        });
                    },

                    //Find all mais lidos
                    function (callback) {
                        var query = post.find().sort({numero_clicks: -1}).limit(5);
                        query.exec(function (err, noticiasMaisLidas) {
                            if (err) {
                                callback(err);
                            }
                            callback(null, noticiasMaisLidas);
                        });
                    }
                ],

                //Compute all results
                function (err, results) {
                    if (err) {
                        console.log(err);
                        res.redirect('/');
                    }

                    if (results == null || results[0] == null) {
                        res.redirect('/');
                    }
                    console.log('valor resultado categoria: ');
                    console.log(results[0]);
                    if (results[0]) {
                        res.render('usuario/pesquisa', {
                            title: 'Hero',
                            noticias: results[0],
                            categorias: results[1],
                            maisLidas: results[2]
                        });
                    } else {
                        res.render('usuario/pesquisavazia', {
                            title: 'Hero',
                            noticias: results[0],
                            categorias: results[1],
                            maisLidas: results[2]
                        });
                    }
                });
        });
    } catch (err) {
        console.log("Falha ao abrir : " + err);
        res.redirect('/usuario/error');
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

router.post('/busca', function (req, res) {

    console.log("Index busca");
    var maisLidas = null;
    var srch = req.params.value;

    console.log(new RegExp(srch));

    try {
        async.parallel([
                // Find all notícias
                function (callback) {
                    var query = post.find({content: new RegExp(srch)}).limit(5);
                    query.exec(function (err, noticias) {
                        if (err) {
                            callback(err);
                        }
                        callback(null, noticias);
                    });
                },

                //Find all categorias
                function (callback) {
                    var query = categoria.find();
                    query.exec(function (err, categoria) {
                        if (err) {
                            callback(err);
                        }

                        callback(null, categoria);
                    });
                },

                //Find all mais lidos
                function (callback) {
                    var query = post.find().sort({numero_clicks: -1}).limit(5);
                    query.exec(function (err, noticiasMaisLidas) {
                        if (err) {
                            callback(err);
                        }
                        callback(null, noticiasMaisLidas);
                    });
                }
            ],

            //Compute all results
            function (err, results) {
                if (err) {
                    console.log(err);
                    res.redirect('/');
                }

                if (results == null || results[0] == null) {
                    res.redirect('/');
                }
                console.log('valor resultado busca: ');
                console.log(results[0]);
                if (!results[0]) {
                    res.render('usuario/pesquisa', {
                        title: 'Hero',
                        noticias: results[0],
                        categorias: results[1],
                        maisLidas: results[2]
                    });
                } else {
                    res.render('usuario/pesquisavazia', {
                        title: 'Hero',
                        noticias: results[0],
                        categorias: results[1],
                        maisLidas: results[2]
                    });
                }
            });

    } catch (err) {
        console.log("Falha ao abrir : " + err);
        res.redirect('/usuario/error');
    }

    /*


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
     });*/

});

router.post('/search', function (req, res) {

    console.log("Index search");
    var maisLidas = null;
    var srch = req.body.search_noticia;
    var usuario_logado = req.session.logged;
    console.log(new RegExp(srch));


    try {
        async.parallel([
                // Find all notícias
                function (callback) {
                    var query = post.find({content: new RegExp(srch)}).limit(5);
                    query.exec(function (err, noticias) {
                        if (err) {
                            callback(err);
                        }
                        callback(null, noticias);
                    });
                },

                //Find all categorias
                function (callback) {
                    var query = categoria.find();
                    query.exec(function (err, categoria) {
                        if (err) {
                            callback(err);
                        }

                        callback(null, categoria);
                    });
                },

                //Find all mais lidos
                function (callback) {
                    var query = post.find().sort({numero_clicks: -1}).limit(5);
                    query.exec(function (err, noticiasMaisLidas) {
                        if (err) {
                            callback(err);
                        }
                        callback(null, noticiasMaisLidas);
                    });
                }
            ],

            //Compute all results
            function (err, results) {
                if (err) {
                    console.log(err);
                    res.redirect('/');
                }

                if (results == null || results[0] == null) {
                    res.redirect('/');
                }
                console.log('valor resultado busca: ');
                console.log(results[0]);
                if (!results[0]) {
                    res.render('usuario/pesquisa', {
                        title: 'Hero',
                        noticias: results[0],
                        categorias: results[1],
                        maisLidas: results[2]
                    });
                } else {
                    res.render('usuario/pesquisavazia', {
                        title: 'Hero',
                        noticias: results[0],
                        categorias: results[1],
                        maisLidas: results[2]
                    });
                }
            });

    } catch (err) {
        console.log("Falha ao abrir : " + err);
        res.redirect('/usuario/error');
    }

    /*


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
     });*/

});


module.exports = router;
