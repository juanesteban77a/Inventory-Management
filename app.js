const express = require('express')
const app = express()
const { body,  validationResult  } = require("express-validator")
const sqlite3=require('sqlite3');
const path = require("path")
const db = new sqlite3.Database('./db/inventars.db')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require('bcrypt');
const port = 10101
app.use(express.static(path.join(__dirname, "/public")));
const nodemailer=require('nodemailer');
const cookieParse = require("cookie-parser")
const sessions  = require("express-session");
const { stringify } = require('querystring');




app.set('view engine', 'ejs');


app.use(cookieParse())
const timeEXp = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: "rfghf66a76ythggi87au7td",
    saveUninitialized:true,
    cookie: { maxAge: timeEXp },
    resave: 'welcome to bibliotec'
}));
const transport = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port:587,
  auth:{
    user:'juanmarianavalery@gmail.com',
    pass:'bqdfeirlbwlcbjlz'
  }
});
app.get('/', (req, res) => {
  res.render('index');
  
  
})

app.post('/registro',
  (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  
  db.run(`INSERT INTO usuario(email,password) VALUES (?, ?)`,
  [email,hash],
    (error) => { 
    if(!error){
      console.log("insert ok")
      transport.sendMail({
        from : 'juanmarianavalery@gmail.com',
        to: email,
        subject: 'confirma',
        html:`<!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Bibliotec</title>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/css/index.css">
            <link rel="shortcut icon" href="media/icon.png" type="image/x-icon">
            <link rel="stylesheet" href="/sweet/sweetalert2.min.css">
            <body>
        

        
        <div class="container" style="box-shadow: 10px 10px red; 
        background-color: black;
        color: white;
        width: 700px;
        height: 700px;
        font-size: 20px;
        text-align: center;
      
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif "" 
        <div class="img" >
<img style="width: 460px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5kXqQM5YG-47_dOcUbLwnD0zzlTmr8H5I1A&usqp=CAU" </div>
<h1 style="margin-bottom: 60px; color:white">EN BIBLIOTEC PODRAS RESERVAR LOS LIBROS QUE MAS TE GUSTAN </h1>
      </div>
        
        
      
        
        
        
                           
                 
        </body>
        </html>`
      }).then((res)=>{console.log(res);}).catch((err)=>{console.log(err);
      })
      return res.redirect("/login");
  }else{
    console.log("insert error", error.code);
    if (error.code == "sQLITE_CONSTRAINT") {
     
       return res.send("el usuario ya existe")
    } 
   
    
  }
  
  

  })
  
})
app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  db.get(`SELECT password FROM usuario WHERE email=$email`,{
    $email:email
  }, (error, rows) =>{
    if(error){
      return res.send("Hubo un error al buscar los registros de la base de datos ")
    } 
   if(rows){
    const passBaseDatos = rows.password;

    if(passBaseDatos){
  
      if (bcrypt.compareSync(password, passBaseDatos)){
        session = req.session;
        session.userid = email;

        return  res.redirect("registrarproducto")
      }else{

       
        res.render('contraseña');
      }
    }
   }else{

     return res.render('contraseña');
   }
    
  })
})

app.post('/administrador', (req, res) => {
    res.render('administrador')
}
)
app.get('/registrarproducto', (req, res) => {
  res.render('registrarproducto');
})
  

app.get('/reserva_libro',  (req, res) => {

  res.render('rion.userid = email;eserva_libro');
})

app.get('/login',(req, res)  => {
    res.render('login');
})
app.get('/registro-exitoso',(req, res)  => {
  res.render('registro-exitoso');
})





app.post('/registro_admin', (req, res) => {
  res.render('login_admin');
})

app.get('/mensaje', (req, res) => {
  res.render('mensaje');
})
app.get('/administrador', (req, res) => {
  res.render('administrador');
})
app.get('/contraseña', (req, res) => {
  res.render('contraseña');
})
app.get('/login_admin', (req, res) => {

  res.render('login_admin');
})

app.post('/login_admin', (req, res) => {

  res.render('login_admin');
})

app.get('/configuracion', (req, res) => {

  res.render('configuracion');
})

app.get('/reserva', (req, res) => {

  res.render('reserva')
});
app.post('/registro_admin',(req, res) => {
  let email_admin= req.body.email.admin;
  let pass_admin= req.body.pass_admin;
  db.run(`INSERT INTO administrador(email_admin,pass_admin) VALUES (?, ?)`,
  [email_admin,pass_admin],
    (error) => {
    if(!error){
      console.log("insert ok")
      res.render("login_admin")
     
  }else{
   res.send("usuario o contraseña incorrecta");
  }
  

  })
  
})
     
  app.post('/login_admin', (req, res) => {
    let email_admin = req.body.email;
    let pass_admin = req.body.password;
      db.get(`SELECT pass_admin FROM administrador WHERE email_admin=$email_admin`,{
        $email_admin:"juanesteban77@gmail.com"
      }, (error, rows) =>{
        if(error){
          return res.send("Hubo un error al buscar los registros de la base de datos ")
        } 
       if(rows){
        const passBaseDatos = rows.pass_admin;
    
        if(passBaseDatos){
      
          if (bcrypt.compareSync(pass_admin, passBaseDatos)){
    
            session = req.session;
            session.userid = email_admin;
            return   res.redirect("/")
          }else{
    
            return res.send(`Usuario o contraseña incorrecta, <a href=\'/login'>Click</a>`)
          }
        }
       }else{
    
         return res.send("Usuario o contraseña incorrecta");
       }
        
      })
    })
      
    app.get('/registro', (req, res) => {
      
     
      db.all("select * from registroproductos",
     
      (error,rows)=>{ 
        console.log(rows);
        if (!error) {
          res.render('registro',{data: rows});
          
        }else{
          res.send("inicie sesion")
        }
      })
      
    })
    
    app.get('/reservar/:idarticulo', (req, res) => {
      session = req.session;
      let id = req.params.idarticulo;
      let validatorId = parseInt(id)
      
      if (isNaN(validatorId)){
        return  res.send("Ingrese id de producto válido");
      }else{
        db.run(`INSERT INTO reserva(id) VALUES (?)`,
        [id],
          (error) => {
          if(!error){
            console.log("insert ok");
            db.get(`SELECT nombre,url FROM libros WHERE id=$id`,{
              $id:id
            },  (error,rows) => {
              transport.sendMail({  
                from : 'juanmarianavalery@gmail.com',
              to: session.userid,
               subject: 'confirma',
              html:` <!DOCTYPE html>
              <html lang="en">
              <head>
                  <title>Bibliotec</title>
                  <meta charset="UTF-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <link rel="stylesheet" href="/css/index.css">
                  <link rel="shortcut icon" href="media/icon.png" type="image/x-icon">
                  <link rel="stylesheet" href="/sweet/sweetalert2.min.css">
                  <body>
              <div class="container" style="  box-shadow: 10px 10px red;
              background-color: black;
              width: 700px;
              height: 880px;
              font-size: 20px;
              text-align: center;
              font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
              <h1 style=" color:white;">TU RESERVA DEL LIBRO</h1> <h2 style="color:blueviolet; margin-top: 40px;"> ${rows.nombre}</h2><h1 style=" color:white;">FUE EXITOSA</h1>
              <img src=${rows.url}  ></div>
              
              
              
              
              
              </div>
              
              
                                 
                       
              </body>
              </html>
              `

             
              }).then((res)=>{console.log(res);}).catch((err)=>{console.log(err);
              })
              res.render("reserva",{data1:rows.nombre} )
            })
            

            
        }else{
          console.log(error);
        }
      }
        )}
        
            
 
    })
  
  
  
      //hacemos el proceso de compra en la bd...
      //enviamos un correo de confirmacion de compra...
      //retornamos un mensaje de compra exitosa
  

app.get("/biblioteca",(req,res)=>{
  
  session = req.session
  if (session.userid) {
    res.render("index2")
    
  }else{

    res.send("debes inicia sesion")
  }

})
app.post("/registrarproducto",(req,res)=>{
  let id = req.body.id;
  let categoria=req.body.categoria;
  let nombre=req.body.nombre;
  let descripcion=req.body.descripcion;
  let fechaven=req.body.fechaven;
  let envalaje=req.body.envalaje;
  let cantidad=req.body.cantidad;
  db.run(`INSERT INTO registroproductos(id,categoria,nombre,descripcion,fechaven,envalaje,cantidad) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [id,categoria,nombre,descripcion,fechaven,envalaje,cantidad],
   (error)=>{
    if (!error) {
      console.log("insert ok");
      res.render(`registro-exitoso`)
      
    }else{
      
      console.log("no se pudo insertar");
    }

  })


})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
