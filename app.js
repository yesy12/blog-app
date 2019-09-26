//Modulos
  //Principal do Site
  const express = require("express");
  const handlebars = require("express-handlebars");
  const bodyParser = require("body-parser");
  const app = express();
  //rotas
  const admin = require("./routes/admin")
  const usuario = require("./routes/usuario")
  
  const path = require("path");
  const mongoose = require("mongoose");
  const session = require("express-session");
  const flash = require("connect-flash");
  
  const passport = require("passport")
  require("./config/auth")(passport)
  
  //Model
  require("./models/Postagem")
  require("./models/Categoria")
  const Postagem = mongoose.model("postagens")
  const Categoria = mongoose.model("categorias")  
  

  
//Config
  //Session
    app.use(session({
      secret:"nodejs",
      resave:true,
      saveUninitialized:true
    }))
    
    app.use(passport.initialize())
    app.use(passport.session())
    
    
    app.use(flash());
    
  //Middleware
    app.use(function(req,res,next){
      res.locals.success_msg = req.flash("success_msg");
      //variaveis globais
      res.locals.error_msg = req.flash("error_msg");
      res.locals.error = req.flash("error")
      res.locals.user = req.user || null;
      next();
    })
    
  //body-parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
    
  //Handlebars
    app.engine("handlebars",handlebars({defaultLayout:"main"}))
    app.set("view engine","handlebars")
    
  //Mongoose
    mongoose.Promise = global.Promise;
	const link = "mongodb+srv://express:<password>@cluster0-nth3w.mongodb.net/test?retryWrites=true&w=majority"
    mongoose.connect(link,   {useNewUrlParser: true }).
    then(function(){
      console.log("Conectado ao MongoDB")
    }).catch(function(error){
      console.log("ERRO: "+error)
    })
    
  //Public
    app.use(express.static(path.join(__dirname,"public/") ))
    //Onde os arquivos js,e css se encontram
    

//Rotas
  //Rotas do Caminho normal
  app.get("/",function(req,res){
    Postagem.find().populate("categoria").sort({
      data:"desc"
    })
    .then(function(postagens) {
      res.render("index",{
        postagens:postagens
      })
    })
    .catch(function(error){
      req.flash("error_msg","Houve um erro interno")
      res.redirect("/404")
    })
  })
  
  app.get("/404",function(req,res){
    res.send("Erro 404")  
  })
  
  app.get("/postagem/:slug",function(req,res){
    Postagem.findOne({
      slug:req.params.slug
    }).populate("categoria")
    .then(function(postagem){
      if(postagem){
        res.render("user/postagem/index",{
          postagem:postagem
        })
      }
      else{
        req.flash("error_msg","Esta postagem não existe")
        res.redirect("/")
      }
    })
    .catch(function(error){
      req.flash("error_msg","Erro interno")
      res.redirect("/")
    })
  })
  
  app.get("/categorias",function(req,res){
    Categoria.find().sort({
      data:"desc"
    })
    .then(function(categorias){
      res.render("user/categorias/index",{
        categorias:categorias
      })
    })
    .catch(function(error){
      console.log(error)
      req.flash("error_msg","Houve um erro interno ao listar categorias")
      res.redirect("/")
    })
  })
  
  app.get("/categoria/:slug",function(req,res){
    Categoria.findOne({
      slug:req.params.slug
    })
    .sort({
      data:"desc"
    })
    .then(function(categoria){
    //then Categoria
      if(categoria){
        
        Postagem.find({
          categoria:categoria._id
        }).populate("categoria")
        //then Postagem
        .then(function(postagens){
          res.render("user/categorias/postagens",{
            postagens:postagens,
            categoria:categoria
          })
        })
        //catch Postagem
        .catch(function(error){
          console.log(error+" /categoria/:slug Postagem.find")
          req.flash("error_msg","Houve um erro ao listar as postagens")
          res.redirect("/")
        })
      }
      else{
        req.flash("error_msg","Não existe essa categoria")
        res.redirect("/")
      }
    })
    //catch Categoria
    .catch(function(erro){
      console.log(erro+" /categoria/:slug Categoria.findOne")
      req.flash("error_msg","Houve um erro interno ao listar os posts da categoria")
      res.redirect("/")
    })
  })
  
  //Rotas do caminhos Admin
  app.use("/admin",admin);
  app.use("/usuarios",usuario);
  
//Outros
  const port = 9000; 
  app.listen(port,function(){
    console.log("Rodando na porta "+port)
  })