
$(document).ready(()=>{
    try{
   // JS for receiver page
   $("#addrec-bar").hide();
   $('#card-details-bar').hide()
   $('#card-msg').hide()
   $('#account-msg').hide()
   

       //make a  post request to server to load available banks
       fetch('/loadbank', {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        }, 
    })
    .then((res)=> res.text())//get responses from server as a promise
    .then((result)=>{ //save bank names into result
        let newResult=JSON.parse(result)// turn bank names to javascript object
        let bankSelect= document.querySelector('#bankName');
        for (let i = 0; i < newResult.length; i++) {
            let options=`<option value="${newResult[i].code}"> ${newResult[i].name}</option>`
            bankSelect.innerHTML+=options//populate the option
        }   
    });

    
   //add bank button
   $("#rec-add-btn").on('click', ()=>{  
    if($("#rec-add-btn").text() == "Close"){
        $("#rec-add-btn").text("Add receiver")
    }else{
        $("#rec-add-btn").text("Close")
    }
    $("#addrec-bar").slideToggle()
   });


   //confirm account button
   $('#confirm-btn').on('click', ()=>{
    $('#account-msg').text('Confirming...')
    $('#account-msg').addClass('alert alert-light')
    $('#account-msg').show()
    let option={
        accountNumber:$('#accountNumber').val(),
        bankCode:$("#bankName option:selected" ).val(),
    }
    // console.log(option)
        fetch('/confirm',{
            method:"POST",
            headers:{
            "Content-Type":"application/json"
            },
            body:JSON.stringify(option)
        })
        .then(res => res.text())
        .then((result)=>{
            // console.log(result)
            lookupResult=JSON.parse(result)   
            if(JSON.parse(result).status=="success"){
                $('#account-msg').text(lookupResult.data.account_name);
                $('#account-msg').removeClass('alert-light')
                $('#account-msg').removeClass('alert-danger')
                $('#account-msg').addClass('alert alert-success')
                $('#account-msg').show()
                $('#btn-addAccount').prop('disabled', false)
            }else{
                $('#account-msg').text("Invalid Account Details");
                $('#account-msg').removeClass('alert-light')
                $('#account-msg').removeClass('alert-success')
                $('#account-msg').addClass('alert alert-danger')
                $('#account-msg').show()
            }
        });
   });

    //Send Bank detials
    $('#btn-addAccount').on('click', (e)=>{
    e.preventDefault();
    let details ={
        acctNumber:$('#accountNumber').val(),
        acctName: $('#acctName').val(),
        bankName:$("#bankName option:selected" ).val(),
        bankRealName:$("#bankName option:selected" ).html()
    }
    fetch ('/addReceiver', {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(details)
    })
    .then(response => response.json())
    .then((result) => {
        if(result.acknowledged == true){
            window.location.href="/receiver"
        } 
    })
    });


    // $('#add').on('click', ()=>{
    //     let cName=$('#nameOnCard').val();
    //     let ccNumber=$('#cc-number').val();
    //     let expDate=$('#expiry-date').val();
    //     let cvv=$('#cvv').val();

    //     let data={
    //         cardName:cName,
    //         cardNumber:ccNumber,
    //         expMonth:expDate.slice(0,2),
    //         expYear:`20${expDate.slice(3,5)}`,
    //         cvv:cvv
    //     }

    //     fetch('/addCard', {
    //         method:"POST",
    //         headers:{
    //             "Content-Type":"application/json"
    //         },
    //         body:JSON.stringify(data)
    //         }).then((response)=> response.text()).then((result)=>{
    //             dbResponse=JSON.parse(result) //parse json response from server
    //         if(dbResponse.acknowledged!=true){
    //             $('#card-msg').text("Not a valid card");
    //             $('#card-msg').show()
    //         }else{                
    //             $('input').val("")
    //             $('#card-details-bar').hide()
    //             $('#card-msg').text("Card Added")
    //             $('#card-msg').show()
    //             window.location.href="/receiver"
    //         }
    //      });
    // });

    //Add card
    $('#add-card').on('click', ()=>{        
        if ($('#add-card').text() == "Close"){
            $('#add-card').text("Add Card")
         } else{
                $('#add-card').text("Close")
         }
        $('#card-details-bar').slideToggle()
    });

    //Expiration card
    let expDate=$('#expiry-date')
    $(expDate).on('keyup', ()=>{
        if(expDate.val().length == 2){
            let expVal = expDate.val()
            expDate.val(expVal + '/')
        }
    });

       //card Details
       $('#btn-addCard').on('click', (e)=>{
        e.preventDefault();
        let details ={
            cardName:$('#nameOnCard').val(),
            cardNumber: $('#cc-number').val(),
            expDate:$("#expiry-date" ).val(),
            cvv:$("#cvv").val()
        }
        fetch ('/addCard', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(details)
        })
        .then(response => response.text())
        .then((result) => {
            if(result == "false"){
                $('#card-msg').show()
                $('#card-msg').text("Card Details incorrect")
            }
            else{
                window.location.reload()
            }
        })
       });

    // remove reveiver
    let removeButton=$('.remove')
    // let accountToRemove=$('.account-number-value')
    for(let i=0; i<removeButton.length; i++){
        $(removeButton[i]).on('click', ()=>{
           let accountDetails={ accontDetails: $(`#acctNumber${i}`).text()}
            fetch('/removeReceiver', {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(accountDetails)
            }).then(res=> res.text()).then((result)=>{
                console.log(result)
                if( result=="true")  window.location.href="/receiver"
            })

        })
    }

    //remove card
    let removeCard=$(".removeCard")
    for(let i=0; i<removeCard.length; i++){
        // console.log(removeButton.length)
        $(removeCard[i]).on('click', ()=>{
            let removeCardDetails={ 
                cardLastDigit: $(`#cardDigit${i}`).text().slice(13,16),
                nameOnCard: $(`#cardName${i}`).text()
            }
            fetch('/removeCard', {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(removeCardDetails)
            }).then(res=> res.text()).then((result)=>{
                // console.log(result)
                if( result=="true")  window.location.href="/receiver"
            });
        });
    }
}catch(e){
    return
}
});