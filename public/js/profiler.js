
// $(document).ready(()=>{    
try{
    editProfile();

    // $('#proofs').hide()
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))//booststrap tooltip
    //contact us @ wosiwosi.co.uk

function editProfile(){
    //disable form
    if($(".forJs").val() !=""){
        $(".forJs").prop('disabled', true)
        $('#save-btn').prop('disabled', true)
    }
    
    //enable form
    $('#edit-btn').on('click', ()=>{
        $('.form-control').prop('disabled', false);
        $('#save-btn').prop('disabled', false)
    })
}

// profileUpdate
$('#save-btn').on('click', (e)=>{
    e.preventDefault()
    const details={
        fname: $('.fname').val(),
        lname: $('.lname').val(),
        phone: $('.phone').val(),
        dob: $('.dob').val(),
        address: $('.address').val(),
        city: $('.city').val(),
        postCode: $('.postcode').val(),
        residence: $('.residence').val(),
        nationality: $('.nationality').val(),


    }
    fetch('/profileUpdate', {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(details)
    }).then(response => response.text())
    .then((result) =>{
        console.log(result)
        if(result =="true") window.location.reload()
    })
})
}catch(e){}
// })
