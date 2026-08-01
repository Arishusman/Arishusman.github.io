// =====================================
// A.U SHOP ADMIN LOGIN
// =====================================

const API_URL ="https://a-u-shop-production-bae8.up.railway.app/api/admin/login";

const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const loginBtn = document.getElementById("loginBtn");

const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

const togglePassword = document.getElementById("togglePassword");
const forgotPassword = document.getElementById("forgotPassword");

// =====================================
// Already Logged In
// =====================================

if(localStorage.getItem("adminLoggedIn")==="true"){

    window.location.href="dashboard.html";

}

// =====================================
// Remember Me
// =====================================

const savedUser=localStorage.getItem("rememberAdmin");

if(savedUser){

    username.value=savedUser;

    rememberMe.checked=true;

}

// =====================================
// Password Show / Hide
// =====================================

togglePassword.addEventListener("click",()=>{

    if(password.type==="password"){

        password.type="text";

        togglePassword.innerHTML='<i class="fa-solid fa-eye-slash"></i>';

    }

    else{

        password.type="password";

        togglePassword.innerHTML='<i class="fa-solid fa-eye"></i>';

    }

});

// =====================================
// Login
// =====================================

loginForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    errorMessage.style.display="none";
    successMessage.style.display="none";

    loginBtn.disabled=true;
    loginBtn.innerHTML="Please Wait...";

    try{

        const response=await fetch(API_URL,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

                
            },

            body:JSON.stringify({

                username:username.value.trim(),

                password:password.value

            })

        });

        const data=await response.json();

        if(!data.success){

            errorMessage.style.display="block";

            errorMessage.innerHTML=data.message;

            loginBtn.disabled=false;

            loginBtn.innerHTML="Login";

            return;

        }

        if(rememberMe.checked){

            localStorage.setItem("rememberAdmin",username.value);

        }

        else{

            localStorage.removeItem("rememberAdmin");

        }

        localStorage.setItem("adminLoggedIn","true");

        localStorage.setItem("adminName",data.admin.username);

        successMessage.style.display="block";

        successMessage.innerHTML="Login Successful...";

        setTimeout(()=>{

            window.location.href="dashboard.html";

        },1000);

    }

    catch(err){

        console.log(err);

        errorMessage.style.display="block";

        errorMessage.innerHTML="Unable to connect server.";

        loginBtn.disabled=false;

        loginBtn.innerHTML="Login";

    }

});

// =====================================
// Forgot Password
// =====================================

forgotPassword.addEventListener("click",(e)=>{

    e.preventDefault();

    alert("Forgot Password feature will be added in next step.");

});