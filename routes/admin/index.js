var express = require('express');
var router = express.Router();

/*  Banco de dados*/
var mongoose = require('mongoose');
var usuarios = mongoose.model('usuario');
var post = mongoose.model('post');
/* Format data*/
var dateFormat = require('dateformat');


/* GET users listing. */
router.get('/', function (req, res) {
    console.log("Index admin");
    console.log("Index admin 1123");
    var usuario_logado = req.session.logged;
    console.log("Usuario logado " + req.session.logged);
    var query = post.find().limit(10);

    try {
        if (usuario_logado != null) {
            console.log("Usuario logado ");

            query.exec(function (err, noticias) {
                if (err) {
                    res.redirect('/');
                }
                res.render('admin/index', {title: 'Administrador', noticias: noticias, usuario: usuario_logado});
            });


        } else {
            res.redirect('/');
        }
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
module.exports = router;
