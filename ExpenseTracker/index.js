function addNewExpense(e){
    e.preventDefault();

    const expenseDetails =  {
        expenseamount: e.target.expenseamount.value,
        description: e.target.description.value,
        category: e.target.category.value
    }
    console.log(expenseDetails);
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/expense/addexpense',expenseDetails,{headers:{'Authorization':token}})
    .then((response)=>{

        addNewExpensetoUI(response.data.expense);

    }).catch(err=>showError(err))
}

/*window.addEventListener('load',()=>{
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/expense/getexpenses',{headers:{'Authorization':token}})
    .then(response=>{
        if(response.status===200){
            response.data.expenses.forEach(expense => {
                addNewExpensetoUI(expense)
            });
        }
    }).catch(err=>console.log(err))
});*/

window.addEventListener('DOMContentLoaded', ()=>{
const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/expense/getexpenses',{headers:{'Authorization':token}}).then(response=>{
        response.data.expenses.forEach(expense=>{
            
            addNewExpensetoUI(expense);
        })
    }).catch(err => {
        showError(err)
    })
});

function addNewExpensetoUI(expense){
    const parentElement =  document.getElementById('listofexpenses');
    const expenseElemId =  `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenseamount} - ${expense.category} - ${expense.description}
            <button onclick = 'deleteExpense(event,${expense.id})'>
             Delete Expense
            </button>
            
        </li> `
    
    
}

function deleteExpense(e,expenseid){
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`,{headers:{'Authorization':token}}).then((response)=>{
        removeExpensefromUI(expenseid)

    }).catch((err=>{
        showError(err)
    }))
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}


document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "name": "Test Company",
     "order_id": response.data.order.id, // For one time payment
     "prefill": {
       "name": "Test User",
       "email": "test.user@example.com",
       "contact": "8770382490"
     },
     "theme": {
      "color": "#3399cc"
     },
     // This handler function will handle the success payment
     "handler": function (response) {
         console.log(response);
         axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} }).then(() => {
             alert('You are a Premium User Now')
         }).catch(() => {
             alert('Something went wrong. Try Again!!!')
         })
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
  alert(response.error.code);
  
 });
}