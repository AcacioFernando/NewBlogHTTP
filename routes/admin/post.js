var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/*  Banco de dados */
var mongoose = require('mongoose');
var post = mongoose.model('post');
var categoria = mongoose.model('categoria');


var dateFormat = require('dateformat');


cloudinary.config({
    cloud_name: 'hhesifpnv',
    api_key: '141879992121428',
    api_secret: 'VJwXZ-LKL1j2IEKiegA0-M_Jr2A'
});

var dir = "http://res.cloudinary.com/hhesifpnv/image/upload/v1458525686/";

/* GET users listing. */
router.get('/', function (req, res) {
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

router.get('/deletar_post', function (req, res) {
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
                res.redirect('/admin/post');

            }
        });

    } catch (err) {
        console.log("Erro 2: " + err);
        res.redirect('/admin/post');
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
                        res.redirect('/admin/post/deletar_post');
                    });

            } else {
                console.log('Error');
                res.redirect('/admin/post/deletar_post')
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
