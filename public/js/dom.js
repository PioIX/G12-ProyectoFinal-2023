async function fetchLogin(data){
    try {
      const response = await fetch("/login", {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Success:", result)
      
      
        if (result.success == false) {
          swal({
            title: "Datos incorrectos",
            icon: "warning",
            button: "Ok!",
          });
        } 
        else if (result.success == true) {
          localStorage.setItem("mail", data.mail); //Guardo el usuario en el localStorage
          if(result.admin == true){
            location.href ='/admin';
          }
          else {
            location.href ='/salas';
        }}
  
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  function login() {
    let mail = document.getElementById("mail").value
    let contraseña = document.getElementById("contraseña").value
  
    let object = {
        mail: mail,
        contraseña: contraseña
    }
  
    if(object.mail != "" && object.contraseña != ""){
      fetchLogin(object)
      
    }
    else{
      swal({
        title: "No ingreso ningun dato",
        button: "Ok!",
      });
    }
  }
  
  async function fetchBannearJson(data){
    try {
      const response = await fetch("/bannear", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Success:", result)
      
        if (result.bannear == false) {
          swal({
            title: "No existe el usuario",
            icon: "warning",
            button: "Ok!",
          });
        } 
        else if (result.bannear == true) {
          swal({
            title: "Usuario banneado correctamente",
            icon: "success",
            button: "Ok!",
          });
  
    }}
    catch (error) {
      console.error("Error:", error);
    }
  }
  
  
  function bannearUser() {
    let mail = document.getElementById("Mail_ban").value
  
    let data = {
       mail:mail
    }
  
    if(data.mail != ""){
      fetchBannearJson(data) 
    }
    else{
      swal({
        title: "No ingreso ningun mail",
        button: "Ok!",
      });
    }
  }
  
  