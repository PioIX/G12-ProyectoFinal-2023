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
          localStorage.setItem("user", data.user); //Guardo el usuario en el localStorage
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
    let user = document.getElementById("userId").value
    let pass = document.getElementById("passwordId").value
  
    let object = {
        user: user,
        pass: pass
    }
  
    if(object.user != "" && object.pass != ""){
      fetchLogin(object)
      
    }
    else{
      swal({
        title: "No ingreso ningun dato",
        button: "Ok!",
      });
    }
  }
  
