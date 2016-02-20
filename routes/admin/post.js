var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/*  Banco de dados */
var mongoose = require('mongoose');
var post = mongoose.model('post');


var dateFormat = require('dateformat');


cloudinary.config({
    cloud_name: 'hlrpvlno9',
    api_key: '233981594891625',
    api_secret: '95VDJfIMfT_10QuSBvqkoAl24xc'
});


/* GET users listing. */
router.get('/', function (req, res) {
    console.log("Post admin");

    console.log(req.session.logged);

    var usuario_logado = req.session.logged;
    console.log("Usuario logado " + req.session.logged);

    if (usuario_logado != null) {

        res.render('admin/postCreate', {title: 'Administrador', usuario: usuario_logado});
    } else {
        res.redirect('/');
    }
});

router.get('/deletar_post', function (req, res) {
    console.log("Deletar post");
    var usuario_logado = req.session.logged;

    if (usuario_logado != null) {
        post.find(function (err, posts) {
            if (err) {
                return console.error(err);
            } else if (posts) {
                console.log(posts);
                console.log("Deu certo");
                res.render('admin/postDelete', {
                    title: "title",
                    subTitle: "title",
                    posts: posts,
                    usuario: usuario_logado
                });
            } else {
                res.render('admin/postDelete', {
                    title: "title",
                    subTitle: "title",
                    posts: null,
                    usuario: usuario_logado
                })
            }
        });
    } else {
        res.redirect('/');
    }
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
            , image_name = image_name_ext.replace(".jpg", "");
        ;

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

module.exports = router;
