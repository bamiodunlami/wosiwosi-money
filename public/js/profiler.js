
$(document).ready(()=>{    

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

    
})