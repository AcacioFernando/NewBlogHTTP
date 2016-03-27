var express = require('express');
var router = express.Router();

var cloudinary = require('cloudinary');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/*  Banco de dados*/
var mongoose = require('mongoose');
var usuarios = mongoose.model('usuario');
var post = mongoose.model('post');
var categoria = mongoose.model('categoria');

/* Format data*/
var dateFormat = require('dateformat');
cloudinary.config({
    cloud_name: 'ha6q3sykc',
    api_key: '368551756826488',
    api_secret: 'Ax0yp4DOIidFH7tg3ZQJAKPH5go'
});
var dir = "http://res.cloudinary.com/ha6q3sykc/image/upload/v1458607970/";


/* GET users listing. */
router.get('/', function (req, res) {
    console.log("Index admin");
    console.log("Index admin 1123");

    var query = post.find().limit(10);

    try {
        /*     if (usuario_logado != null) {*/
        query.exec(function (err, noticias) {
            if (err) {
                res.redirect('/');
            }
            res.render('admin/index', {title: 'Administrador', noticias: noticias});
        });

        /*     } else {
         res.redirect('/');
         }*/
    } catch (err) {
        res.redirect('/');
    }

});

router.get('/registro', function (req, res) {
    console.log("Registro admin");
    res.render('admin/registro', {feedback: ''});
});

router.post('/registrar', function (req, res) {
    console.log("Registrar admin");

    var username = req.body.admin_username;
    console.log(username);
    var email = req.body.admin_email;
    console.log(username);
    var password = req.body.admin_password;
    console.log(password);
    var retype_password = req.body.retype_password;
    console.log(retype_password);

    var time = new Date();
    time = dateFormat(time, "yyyy-mm-dd h:MM:ss");

    if (password != retype_password) {

        res.render('admin/registro', {feedback: 'Falha ao cadastrar. Senhas não conferem'});
    }

    try {
        usuarios.create({
            admin_username: username,
            admin_email: email,
            admin_password: password,
            date: time
        }, function (err, user) {
            if (err) {
                console.log(err);
                //redirecting to homepage
                res.render('admin/registro', {feedback: 'Falha ao cadastrar'});
                /*     res.redirect('/erro');*/
            } else {
                var mensagem = user.admin_username + ' cadastrado com sucesso';
                console.log(mensagem);
                res.render('admin/registro', {feedback: mensagem});
            }

        });

    } catch (err) {
        console.log("Erro 2: " + err);
        res.render('admin/registro', {feedback: 'Falha ao cadastrar'});
    }

});


router.post('/login', function (req, res) {
    sess = req.session;

    console.log("Login admin");

    var username = req.body.admin_username;
    console.log(username);
    var password = req.body.admin_password;
    console.log(password);

    usuarios.findOne({admin_email: username}, function (err, usuario) {

        console.log(usuario);

        if (err || usuario == null) {

            req.session.logged = null;
            console.log("Usuario nao localizado: " + err);
            res.redirect('/');

        } else {
            if (usuario.admin_password == password) {
                console.log('Logado com sucesso');
                req.session.logged = usuario;
                sess = usuario;
                console.log(req.session.logged);
                console.log('Passei aqui');
                res.redirect('/admin');
            } else {
                req.session.logged = null;
                sess = null;
                console.log(req.session.logged);
                console.log('Passwords não confere:' + err);
                res.redirect('/');
            }
        }
    });


});

router.get('/logout', function (req, res) {

    Console.log("Logout: " + req.session.logged);

    req.session.logged = null;
    res.redirect('/');
});



/*Posts*/

/* GET users listing. */
router.get('/cadastrarnoticia', function (req, res) {
    console.log("Post admin");
    var query_categoria = categoria.find();

    /*    var usuario_logado = req.session.logged;
     console.log("Usuario logado " + req.session.logged);

     if (usuario_logado != null) {*/

    query_categoria.exec(function (err, categorias) {
        if (err) {
            console.error("Error query categoria find: " + err);
            res.redirect('usuario/error');

        } else {
            console.log("Categorias: ");
            console.log(categorias);
            res.render('admin/postCreate', {title: 'Administrador', categorias: categorias});

        }
    });
    /*
     } else {
     res.redirect('/');
     }*/
});

router.get('/deletarnoticia', function (req, res) {
    console.log("Deletar post");
    /*    var usuario_logado = req.session.logged;

     if (usuario_logado != null) {*/
    post.find(function (err, posts) {
        if (err) {
            return console.error(err);
        } else if (posts) {
            console.log(posts);
            console.log("Deu certo");
            res.render('admin/postDelete', {
                title: "title",
                subTitle: "title",
                posts: posts
            });
        } else {
            res.render('admin/postDelete', {
                title: "title",
                subTitle: "title",
                posts: null
            })
        }
    });
    /*    } else {
     res.redirect('/');
     }*/
});

/* Submit new form post*/
router.post('/cadastrar_post', multipartMiddleware, function (req, res, next) {

    console.log("salvarPost");

    var error = null;
    var time = new Date();
    time = dateFormat(time, "yyyy-mm-dd h:MM:ss");
    console.log(time);

    try {
        console.log(200, {'content-type': 'text/plain'});

        var title_post = time.split(' ').join('-');

        console.log(title_post);

        var image = req.files.inputImagem
            , image_upload_path_old = image.path
            , image_upload_name = image.name.split(' ').join('-')
            , image_name_ext = title_post + image_upload_name
            , image_name = image_name_ext.replace(".jpg", "")
            , image_name_ext = dir + image_name_ext;

        console.log(image_name);

        post.create({
            title: req.body.inputTitulo,
            title_sub: req.body.inputSubTitulo,
            content: req.body.inputPost,
            category: req.body.inputCategoria,
            sub_title: req.body.inputSubTitulo,
            date: time,
            img: image_name_ext,
            numero_clicks: Number(0),
            gostei: Number(0),
            nao_gostei: Number(0)
        }, function (err, user) {
            if (err) {
                error = err;
                //redirecting to homepage
                console.log("Erro 1: " + error);
                /*     res.redirect('/erro');*/
            }
            if (user) {
                console.log("Sem errro ");
                // Testa se o diretório upload existe na pasta atual
                cloudinary.uploader.upload(
                    image_upload_path_old,
                    function (result) {
                        console.log(result);
                    },
                    {
                        public_id: image_name
                    });
                res.redirect('/admin/cadastrarnoticia');

            }
        });

    } catch (err) {
        console.log("Erro 2: " + err);
        res.redirect('/admin/cadastrarnoticia');
    }
});

router.post('/deletar_post', multipartMiddleware, function (req, res, next) {

    console.log("Deletar post");

    try {

        var idPost = req.body.inputIDPost;
        console.log("Notificia: " + idPost);
        post.findOne({_id: idPost}, function (err, post) {
            console.log('Achei' + __dirname);
            console.log(post);
            if (post) {

                cloudinary.api.delete_resources_by_tag(post.img,
                    function (result) {
                        console.log(result);
                        post.remove();
                        console.log('removed');
                        res.redirect('/admin/deletarnoticia');
                    });

            } else {
                console.log('Error');
                res.redirect('/admin/deletarnoticia')
            }
        });


    } catch (err) {
        console.log("Erro 2: " + err);
        res.redirect('/admin');
    }
});

router.post('/categoria', function (req, res, next) {

    console.log("Cadastrar categoria");
    var query_categoria = categoria.find();

    try {

        var usuario_logado = req.session.logged;
        console.log("Usuario logado " + req.session.logged);

        var nomeCategoria = req.body.inputCategoria;
        console.log("Categoria: " + nomeCategoria);

        categoria.create({
            nome_categoria: nomeCategoria
        }, function (err, user) {
            if (err) {
                error = err;
                //redirecting to homepage
                console.log("Erro 1: " + error);

            }

            query_categoria.exec(function (err, categorias) {
                if (err) {
                    console.error("Error query categoria find: " + err);
                    res.redirect('usuario/error');

                } else {
                    res.render('admin/postCreate', {
                        title: 'Administrador',
                        categorias: categorias,
                        usuario: usuario_logado
                    });

                }
            });
        });

    } catch (err) {
        console.log("Erro 2: " + err);
        res.redirect('/admin');
    }
});

module.exports = router;
