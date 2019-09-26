const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Model de usuario
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = function(passport){
  passport.use(
    new localStrategy({
        usernameField:"email",
        passwordField:"senha"
      },
      
      function(email,senha,done){
      
        Usuario.findOne({
			email:email
		})
          
        .then(function(usuario){
          
            if(!usuario){

              /*estado se existe,se aconteceu conexão,mensagem*/
              return done(null,false,{
                message:"Essa conta não existe"
              })//return done(null,false)
              
            }//if(!usuario)
          
            else{
          
              bcrypt.compare(senha,usuario.senha,
                function(error,batem){
              
                  if(batem){
                    return done(null,usuario)
                  }//if(batem)
  
                  else{
                    return done(null,false,{
                      message:"Senha incorreta"
                    })//message and return done 
                  }//else
              
                  }//function(error,batem)
              )//bcrypt.compare
            }//else
          })//then function(usuario)
            
        .catch(function(error){
            
            console.log(error+" auth.js Usuario.findOne")
            req.flash("error_msg","Erro no nosso sistema")
            res.redirect("/")
          
          })//catch function(error)
          
      }//function(email,senha,done)
    )//new localStrategy
  )//passport.use
  
  passport.serializeUser(function(usuario,done){
    done(null,usuario.id)
  })//passport.serializeUser
  
  passport.deserializeUser(function(id,done){
    Usuario.findById(id,function(error,usuario){
      done(error,usuario)
    })
  })//passport.deserializeUser
  
}//module.exports