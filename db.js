var mongoose = require('mongoose');
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

//  Schema MongoDB para os posts

var postSchema = new Schema({
    id: ObjectId,
    title: { type: String },
    title_sub: { type: String },
    sub_title: { type: String },
    content: { type: String },
    category: { type: String },
    date: { type: String },
    img: {type: String },
    gostei: {type: Number },
    numero_clicks : {type: Number },
    nao_gostei: {type: Number },
    comments: [{
        id: ObjectId,
        postid: { type: String },
        name: { type: String },
        comment: { type: String },
        date: { type: String }
    }]
});

//  Schema para os comentários
var commentSchema = new Schema({
    id: ObjectId,
    postid: { type: String },
    title_sub: { type: String },
    name: { type: String },
    comment: { type: String },
    date: { type: String }
});

//  Schema para os usuários
var usuarioSchema = new Schema({
    id: ObjectId,
    admin_username: { type: String },
    admin_email: { type: String },
    admin_password: { type: String },
    date: { type: String }
});

var categoriaSchema = new Schema({
    id: ObjectId,
    nome_categoria: { type: String },
});



var post = mongoose.model('post', postSchema);
var comment = mongoose.model('comment', commentSchema);
var usuario = mongoose.model('usuario', usuarioSchema);
var categoria = mongoose.model('categoria', categoriaSchema);

var db_url = process.env.MONGOLAB_URI  || "mongodb://localhost:27017/dbNewBlogHttp",
    db = mongoose.connect(db_url);

