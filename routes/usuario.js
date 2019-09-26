const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registro",function(req,res){
  res.render("usuarios/registro")
})

router.post("/registro/",function(req,res){
  var erros = [];
  
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;
  const senha2 = req.body.senha2;
  
  if(!nome || typeof nome == undefined || nome == null){
    erros.push({
      texto:"Nome Inválido"
    })
  }
  
  if(nome.length > 0 && nome.length < 3){
    erros.push({
      texto:"Nome pequeno"
    })
  }
    
  if(!email || typeof email == undefined || email == null){
    erros.push({
      texto:"E-mail Inválido"
    })
  }  
    
  if(email.length > 0 && email.length < 10){
    erros.push({
      texto:"E-mail muito pequeno"
    })
  }
  
  if(!senha || typeof senha == undefined || senha == null){
    erros.push({
      texto:"Senha Inválida"
    })
  }  
    
  if(senha.length > 0 && senha.length < 8){
    erros.push({
      texto:"Senha muito pequena"
    })
  }
  
  if(!senha2 || typeof senha2 == undefined || senha2 == null){
    erros.push({
      texto:"Repetição de senha  Inválida"
    })
  }  
    
  if(senha != senha2){
    erros.push({
      texto:"A repetição de senha não é a mesma"
    })
  }
  
  if(erros.length > 0){
    res.render("usuarios/registro",{
      erros:erros
    })
  }
  else{
    Usuario.findOne({
      email:email
    })//Usuario findOne
    .then(function(emailDb){
      if(emailDb){
        req.flash("error_msg","Já existe este e-mail cadastrado");
        res.redirect("/usuarios/registro")
      }//if email
      else{
        const novoUsuario = {
          nome,
          email,
          senha
        }
        bcrypt.genSalt(12,function(error,salt){
          
          bcrypt.hash(novoUsuario.senha,salt,function(erro,hash){
            if(erro){
              console.log(erro+" bcrypt /registro/novo")
              req.flash("error_msg","Houve um erro no salvamento")
              res.redirect("/")
            }//if erro
            else{
              novoUsuario.senha = hash
              
              new Usuario(novoUsuario).save()
              .then(function(){
                req.flash("success_msg","Sucesso ao cadastrar você");
                res.redirect("/usuarios/login")
              })//then Usuario
              
              .catch(function(error){
                console.log(error+" Registro/novo/ Salvar usuario Db");
                req.flash("error_msg","Houve um erro interno, tente mais tarde");
                res.redirect("/")
              })//catch Usuario
              
            }//else
          })//bcrypt hash
          
        })//bcrypt genSalt
        

      }//else email
    })//then email
    .catch(function(erro){
      console.log(erro+" Verificacao-Email registro/novo")
      req.flash("error_msg","Erro Interno, tente novamente mais tarde")
      res.redirect("/")
    })//catch email
    
  }//else erros

})

router.get("/login",function(req,res){
  res.render("usuarios/login")
})

router.post("/login",function(req,res,next){
  
  passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/usuarios/login",
    failureFlash:true
  })(req,res,next)
})

module.exports = router;