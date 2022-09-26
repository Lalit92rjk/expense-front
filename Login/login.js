function login(e){
    e.preventDefault();
    console.log(e.target.name);

    const loginDetails={
        email:e.target.email.value,
        password:e.target.password.value

    }
    console.log(loginDetails)
    axios.post('http://localhost:3000/user/login',loginDetails).then(response=>{
        alert(response.data.message)
        window.location.href = "../ExpenseTracker/index.html" // change the page on successful login
    }).catch(err=>{
        console.log(JSON.stringify(err))
        document.body.innerHTML+= `<div style="color:red;">${err.message}</>`
    })
}