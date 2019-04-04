const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get("/",function(req,res){
  res.render("admin/index")
})

router.get("/posts",function(req,res){
  res.send("Página de POSTS")
})

router.get("/categorias",function(req,res){
  Categoria.find().
  then(function(categorias){
     res.render("admin/categorias",{
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
  res.render("admin/add-categorias")
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
      //console.log(req.flash("success_msg"))
    }).catch(function(error){
      req.flash("error_msg","Houve um erro ao criar a categoria,tente novamente mais tarde")
      console.log("erro: "+error)
    })
    console.log(req.flash("success_msg") || req.flash("error_msg"))
    res.redirect("/admin/categorias");

  }
})

router.get("/categorias/editar/:id",function(req,res){
  Categoria.findOne({
    _id:req.params.id
  }).then(function(categoria){
    res.render("admin/edit-categorias",{
      categoria:categoria
    })
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
      
      req.flash("success_msg","Editado com sucesso")
    }).catch(function(error){
      req.flash("error_msg","Houve um erro ao editar")
    })
    
    res.redirect("/admin/categorias");

  }
})

module.exports = router;