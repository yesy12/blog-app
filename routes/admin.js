const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
//Models
require("../models/Categoria")
require("../models/Postagem")
const Categoria = mongoose.model("categorias")
const Postagem = mongoose.model("postagens")

const isAdmin = require("../helpers/isAdmin")
/*
  O req.flash não funcionava porque estava em modo 
  de eventLoop do node, e o node executa tudo que esteja
  fora do eventLoop primeiro.No caso era res.redirect()
*/

router.get("/", function(req,res){
  res.render("admin/index")
})

//Postagens
router.get("/postagens", function(req,res){
  //populate buscar outras informações do campo,tipo nome
  Postagem.find().populate("categoria")
  .sort({
    data:"desc"
  }).then(function(postagens){
    res.render("admin/postagens/index",{
      postagens:postagens
    })
  })
 .catch(function(error){
    req.flash("error_msg","Houve um erro ao acessar a pagina de postagens")
    res.redirect("/admin")
  })
})

router.get("/postagens/add", function(req,res){
  Categoria.find().sort({
    date:"desc"
  })
  .then(function(categorias){
    res.render("admin/postagens/add-postagens",{
      categorias,
    })
  })
  .catch(function(error){
    req.flash("error_msg","Aconteceu um erro ao criar categorias")
    res.redirect("/admin/postagens/")
  })
})

router.post("/postagens/nova",function(req,res){
  
  const titulo = req.body.titulo;
  const categoriaPostagem = req.body.categoriaPostagem;
  const slugPostagem = req.body.slugPostagem;
  const slugPostagemCompleto = req.body.slugPostagemCompleto;
  const descricaoPostagem = req.body.descricaoPostagem;
  const conteudoPostagem = req.body.conteudoPostagem;
  
  var erros = [];
  
  //Titulo
  if(!titulo || typeof titulo == undefined || titulo == null){
    erros.push({
      texto:"Título Inválido"
    })
  }
  
  if(titulo.length > 0 && titulo.length < 10){
    erros.push({
      texto:"Título muito pequeno"
    })  
  }
  
  //CategoriaPostagem
  if(!categoriaPostagem || typeof categoriaPostagem == undefined || categoriaPostagem == null || categoriaPostagem == "sem-categorias"){
      erros.push({
        texto:"Categoria Inválida"
    })
  }
    
  //slugPostagem
  if(!slugPostagem || typeof slugPostagem == undefined || slugPostagem == null){
    erros.push({
      texto:"Slug da Postagem Inválido"
    })
  }
  
  if(slugPostagem.length >0 && slugPostagem.length < 10){
    erros.push({
      texto:"Slug da postagem muito pequeno"
    })  
  }
  
  //slugPostagemCompleto
  var verificarSlug = categoriaPostagem + "/" + slugPostagem
  if(verificarSlug != slugPostagemCompleto){
    erros.push({
      texto:"O slug deve se digitado corretamente,com letras minusculas e com - entre os espaços"
    })
  }
  
  //DescricaoPostagem
  if(!descricaoPostagem || typeof descricaoPostagem == undefined || descricaoPostagem == null){
    erros.push({
      texto:"Descrição da Postagem Inválido"
    })
  }
  
  if(descricaoPostagem.length >0 && descricaoPostagem.length < 10){
    erros.push({
      texto:"Descrição da postagem muito pequeno"
    })  
  }
  
  //ConteudoPostagem
  if(!conteudoPostagem || typeof conteudoPostagem == undefined || conteudoPostagem == null){
    erros.push({
      texto:"Conteudo da Postagem Inválido"
    })
  }
  
  if(conteudoPostagem.length >0 && conteudoPostagem.length < 10){
    erros.push({
      texto:"Conteudo da postagem muito pequeno"
    })  
  }
  
  if(erros.length > 0){
    Categoria.find().sort({
      date:"desc"
    })
    .then(function(categorias){
      res.render("admin/postagens/add-postagens",{
        erros,
        categorias,
      })
    })
  }
  else{
    const novaPostagem = {
      titulo,
      categoria: categoriaPostagem,
      slug:slugPostagem,
      slugCompleto: slugPostagemCompleto,
      descricao: descricaoPostagem,
      conteudo: conteudoPostagem
    }
    
    new Postagem(novaPostagem).save()
    .then(function(){
      req.flash("success_msg","Postagem salva com sucesso")
      res.redirect("/admin/postagens/")
    })
    .catch(function(error){
      req.flash("error_msg","Houve um erro ao salvar a postagem")
      console.log("erro: "+error)
      res.redirect("/admin/postagens/")
    })
  }
  
})

router.get("/postagens/editar/:id/:slug",function(req,res){
  Postagem.findOne({
    _id:req.params.id,
    slug:req.params.slug
  }).populate("categoria")
  
  .then(function(postagem){
    Categoria.find().sort({
      data:"desc"
    })
    .then(function(categorias){
      res.render("admin/postagens/edit-postagens",{
        postagem:postagem,
        categorias:categorias
      })
    })
    .catch(function(error){
      req.flash("error_msg","Houve um erro ao editar a postagem")
      res.redirect("admin/postagens")
    })

  })
  .catch(function(error){
    req.flash("error_msg","Essa categoria não existe")
    res.redirect("/admin/postagens/postagens")
  })
  
})

router.post("/postagens/edita",function(req,res){

  const id = req.body.id;
  const titulo = req.body.titulo;
  const categoriaPostagem = req.body.categoriaPostagem;
  const slugPostagem = req.body.slugPostagem;
  const slugPostagemCompleto = req.body.slugPostagemCompleto;
  const descricaoPostagem = req.body.descricaoPostagem;
  const conteudoPostagem = req.body.conteudoPostagem;
  
  var erros = [];
  
  //Titulo
  if(!titulo || typeof titulo == undefined || titulo == null){
    erros.push({
      texto:"Título Inválido"
    })
  }
  
  if(titulo.length > 0 && titulo.length < 10){
    erros.push({
      texto:"Título muito pequeno"
    })  
  }
  
  //CategoriaPostagem
  if(!categoriaPostagem || typeof categoriaPostagem == undefined || categoriaPostagem == null || categoriaPostagem == "sem-categorias"){
      erros.push({
        texto:"Categoria Inválida"
    })
  }
  
  
  //slugPostagem
  if(!slugPostagem || typeof slugPostagem == undefined || slugPostagem == null){
    erros.push({
      texto:"Slug da Postagem Inválido"
    })
  }
  
  if(slugPostagem.length >0 && slugPostagem.length < 10){
    erros.push({
      texto:"Slug da postagem muito pequeno"
    })  
  }
  
  //slugPostagemCompleto
  var verificarSlug = categoriaPostagem + "/" + slugPostagem
  if(verificarSlug != slugPostagemCompleto){
    erros.push({
      texto:"O slug deve se digitado corretamente,com letras minusculas e com - entre os espaços"
    })
  }
  
  //DescricaoPostagem
  if(!descricaoPostagem || typeof descricaoPostagem == undefined || descricaoPostagem == null){
    erros.push({
      texto:"Descrição da Postagem Inválido"
    })
  }
  
  if(descricaoPostagem.length >0 && descricaoPostagem.length < 10){
    erros.push({
      texto:"Descrição da postagem muito pequeno"
    })  
  }
  
  //ConteudoPostagem
  if(!conteudoPostagem || typeof conteudoPostagem == undefined || conteudoPostagem == null){
    erros.push({
      texto:"Conteudo da Postagem Inválido"
    })
  }
  
  if(conteudoPostagem.length >0 && conteudoPostagem.length < 10){
    erros.push({
      texto:"Conteudo da postagem muito pequeno"
    })  
  }
  
  if(erros.length > 0){
    Categoria.find().sort({
      date:"desc"
    })
    .then(function(categorias){
      res.render("admin/postagens/add-postagens",{
        erros,
        categorias,
      })
    })
  }
  else{
    Postagem.findOne({
      _id:id,
      slug:slugPostagem
    })
    .then(function(postagem){

      postagem.titulo= titulo;
      postagem.categoria = categoriaPostagem;
      postagem.slug = slugPostagem;
      postagem.slugCompleto = slugPostagemCompleto;
      postagem.descricao = descricaoPostagem;
      postagem.conteudo = conteudoPostagem;
    
      postagem.save()  
      .then(function(){
        req.flash("success_msg","Postagem editada com sucesso")
        res.redirect("/admin/postagens/")
      })
      .catch(function(error){
        req.flash("error_msg","Houve um erro ao editar a postagem 2")
        console.log("erro: "+error)
        res.redirect("/admin/postagens/")
      })
     
    })
    .catch(function(error){
      req.flash("error_msg","Houve um erro ao editar a postagem")
      console.log("erro: "+error)
      res.redirect("/admin/postagens")
    })
  }
  
})

router.get("/postagens/delete/:id/:slug",function(req,res){
  Postagem.findOne({
    _id:req.params.id,
    slug:req.params.slug
  })
  .then(function(postagem){
    res.render("admin/postagens/delete-postagens",{
      postagem:postagem
    })
  })
  .catch(function(error){
    req.flash("error_msg","Não existe essa postagem")
    res.redirect("/admin/postagens/")
  })
})

router.post("/postagens/delete",function(req,res){
  const id = req.body.id;
  const slug = req.body.slug;
  const excluir = req.body.excluir;
  
  var erros = [];
  
  if(excluir == "nao"){
    req.flash("error_msg","Postagem não foi apagada")
    res.redirect("/admin/postagens")
  }
  else if(excluir == null || !excluir || typeof excluir == undefined){
    erros.push({
      texto:"Decisão excluir invalida"
    })
  }
  
  if(erros.length > 0){
    Postagem.findOne({
      _id:id,
      slug:slug
    })
    .then(function(postagem){
      res.render("admin/postagens/delete-postagens",{
        erros,
        postagem,
      })
    })
    .catch(function(error){
      req.flash("error_msg","Acabou acontecendo um erro")
      res.redirect("/admin/postagens/postagens")
    })
  }
  else if(excluir == "sim"){
    Postagem.deleteOne({
      _id:id,
      slug:slug
    })
    .then(function(postagem){
      req.flash("success_msg","Postagem apagada com sucesso")
      res.redirect("/admin/postagens/")
    })
    .catch(function(error){
      req.flash("error_msg","Erro ao apagar a postagem")
      res.redirect("/admin/postagens/")
    })
  }
})

//Categorias
router.get("/categorias",function(req,res){
  Categoria.find().sort({
    date:"desc"
  }).
  then(function(categorias){
     res.render("admin/categorias/index",{
       categorias:categorias
     })
  })
  .catch(function(error){
    req.flash("error_msg","Houve um erro ao entra na categorias")
    console.log("Erro: "+error)
    res.redirect("/admin/")
  })
})

router.get("/categorias/add",function(req,res){
  res.render("admin/categorias/add-categorias")
})

router.post("/categorias/nova",function(req,res){
  
  const nome = req.body.nome
  const slug = req.body.slug
  
  var erros = [];
  
  if(!nome || typeof nome == undefined || nome == null){
    erros.push({
      texto:"Nome Inválido"
    })
  }
  
  if(nome.length >0 && nome.length< 3){
    erros.push({
      texto:"Nome da categoria muito pequeno"
    })
  }
  
  if(!slug || typeof slug == undefined || slug == null){
    erros.push({
      texto:"Slug Inválido"
    })
  }
  
  if(erros.length > 0){
    res.render("admin/add-categorias",{
      erros,
    })
  }
  else{ 
    const novaCategoria = {
      nome,
      slug
    }
    //Dados a serem salvos 
    
    new Categoria(novaCategoria).save().//Salvando no Db
    then(function(){
      req.flash("success_msg","Categoria salva com sucesso");
      res.redirect("/admin/categorias")
    }).
    catch(function(error){
      req.flash("error_msg","Houve um erro ao criar a categoria,tente novamente mais tarde")
      console.log("erro: "+error)
      res.redirect("/admin/categorias")
    })
  }
})

router.get("/categorias/editar/:id",function(req,res){
  Categoria.findOne({
    _id:req.params.id
  }).then(function(categoria){
    res.render("admin/categorias/edit-categorias",{
      categoria:categoria
    })
  }).catch(function(error){
    console.log("ERRO: "+error)
    req.flash("error_msg","Categoria Invalida")
    res.redirect("/admin/categorias")
  })
  
})

router.post("/categorias/edit",function(req,res){
  
  const nome = req.body.nome
  const slug = req.body.slug
  
  var erros = [];
  
  if(!nome || typeof nome == undefined || nome == null){
    erros.push({
      texto:"Nome Inválido"
    })
  }
  
  if(nome.length >0 && nome.length< 3){
    erros.push({
      texto:"Nome da categoria muito pequeno"
    })
  }
  
  if(!slug || typeof slug == undefined || slug == null){
    erros.push({
      texto:"Slug Inválido"
    })
  }
  
  if(erros.length > 0){
    res.render("admin/add-categorias",{
      erros,
    })
  }
  else{ 
    Categoria.findOne({
      _id:req.body.id
    }).then(function(categoria){
      categoria.nome = nome
      categoria.slug = slug
      
      categoria.save().then(function(){
        req.flash("success_msg","Editado com sucesso")
        res.redirect("/admin/categorias")
      })
      .catch(function(error){
        req.flash("error_msg","Houve um erro ao salvar a edição")
        res.redirect("/admin/categorias")
      })
    }).catch(function(error){
      req.flash("error_msg","Houve um erro ao editar")
      res.redirect("/admin/categorias")
    })
  }
})

router.get("/categorias/delete/:id",function(req,res){
  Categoria.findOne({
    _id:req.params.id
  }).
  then(function(categoria){
    Postagem.find({
      categoria: req.params.id
    }).populate("categoria")
    .then(function(postagens){
      res.render("admin/categorias/delete-categorias",{
        categoria:categoria,
        postagens:postagens
      })
    })
  })
  .catch(function(error){
    req.flash("error_msg","Provavelmente essa categoria não existe")
    res.redirect("admin/categorias")
  })
})

router.post("/categorias/delete",function(req,res){
  const id = req.body.idCategoria
  const excluir = req.body.excluir
  const semPostagem = req.body.semPostagem || "não";
  
  var erros = [];
  
  if(excluir == "nao"){
    req.flash("error_msg","Categoria não foi apagada")
    res.redirect("/admin/categorias")
  }
  else if(excluir == null || !excluir || typeof excluir == undefined){
    erros.push({
      texto:"Decisão excluir invalida"
    })
  }
  
  if(erros.length > 0){
    Categoria.findOne({
      _id:id
    })
    .then(function(categoria){
      res.render("admin/categorias/delete-categorias",{
        erros,
        categoria,
      })
    })
    .catch(function(error){
      req.flash("error_msg","Acabou acontecendo um erro")
      res.redirect("/admin/categoria")
    })
  }
  else if(excluir == "sim"  && semPostagem == "não"){
    Postagem.find({
      categoria:id
    }).deleteMany()
    //then Postagem
    .then(function(){
      Categoria.deleteOne({
        _id:id
      })
      //then Categoria
      .then(function(){
        req.flash("success_msg","A Categoria e postagens da mesma foram apagadas")
        res.redirect("/admin/categorias")
      })
      //catch Categoria
      .catch(function(error){
        req.flash("error_msg","As postagens foram apagadas mas a categoria não")
        res.redirect("/admin/categorias")
      })
    })
    //catch Postagem
    .catch(function(error){
      req.flash("error_msg","As postagens e categorias não foram apagadas")
      res.redirect("/admin/categorias")
    })
  }
  else if(excluir == "sim"  && semPostagem == "sim"){
      Categoria.deleteOne({
        _id:id
      })
      //then categoria
      .then(function(){
        req.flash("success_msg","A Categoria foi apagada,e as postagens não existe")
        res.redirect("/admin/categorias")
      })
      //catch Categoria
      .catch(function(error){
        req.flash("error_msg","A Categoria não foi apagada,e as postagens não existem")
        res.redirect("/admin/categorias")
      })
  }
})

module.exports = router;