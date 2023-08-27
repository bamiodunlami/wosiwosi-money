$(document).ready(function(){
    
    $("#passwordMessage").hide()//hide error label
    $("#passwordMessageTwo").hide()//hide error label

    // $("#login-re").on('click', ()=>{
    //     $("#reset-bar").hide();   
    //     $("#login-bar-main").show();    
    // })

    // $("#reset").on('click', ()=>{
    //     $("#login-bar-main").hide();
    //     $("#reset-bar").show();
    // });

    // $("#reset-login").on('click', ()=>{
    //     $("#reset-bar").hide();   
    //     $("#login-bar-main").show();    
    // })

    //check password and ters 
    $("#password").on('keydown', ()=>{ 
        let password=$("#password").val();
        if(password.length <= 8){
            $("#passwordMessage").text("Weak Password")            
            $("#passwordMessage").show()//hide error label
            $("#signup").prop("disabled", true)
        }
        else{        
            $("#passwordMessage").hide()//hide error label
            $("#confirmPassword").prop("disabled", false)
        }
    })



    // check tearms
    $("#signup").prop('disabled', true)
    let terms=$("#terms");
    terms.on("change", ()=>{
        if(terms.prop('checked')==true){
            $("#signup").prop('disabled', false);
            $("#passwordMessage").hide()//hide error label
        } else{
            $("#passwordMessage").text("Kindly check the terms")            
            $("#passwordMessage").show()//hide error label
            $("#signup").prop('disabled', true) 
        }
    })
    

    // reset password
    const emailField = $('#emailField')
    const resetBtn = $("#resetBtn")
    resetBtn.on('click', (e)=>{
        e.preventDefault()
        const details = {
            email:emailField.val()
        }
        fetch('/reset', {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(details)
        }).then(response => response.text())
        .then((result)=>{
            if(result == "true"){
                alert("Password reset link sent to your mail, it may take up to 2min to appear on your mail.");
            }else{
                alert("Email does not exist");
            }
        })
    })


    // reset password check length
        //check password and ters 
        $("#pasReset").on('keydown', ()=>{ 
            let password=$("#pasReset").val();
            if(password.length <= 8){
                $("#passwordMessage").text("Weak Password")            
                $("#passwordMessage").show()//hide error label
                $("#changeBtn").prop("disabled", true)
            }
            else{        
                $("#passwordMessage").hide()//hide error label
                $("#changeBtn").prop("disabled", false)
            }
        })
});