// $(document).ready(()=>{
    try{
    const verificationButton = $('#tVerify')
    const idInput = $('.tInput')
    verificationButton.on('click', (e)=>{
        e.preventDefault()
        let body ={
            id:idInput.val()
        }
        fetch('/verifyTransaction', {
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(body)
        }).then(response => response.json())
        .then((result)=>{
            alert(result.status)
        })
    })
}catch(e){}
// })