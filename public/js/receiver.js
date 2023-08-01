
$(document).ready(()=>{
   // JS for receiver page
   $("#addrec-bar").hide();
   $('#card-details-bar').hide()
   $('#card-msg').hide()

   //add bank button
   $("#rec-add-btn").on('click', ()=>{
    //make a  post request to server to load available banks
    fetch('/loadbank', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            }, 
        })
        .then((res)=> res.text())//get responses from server as a promise
        .then((result)=>{ //save bank names into result
            // console.log(result)
            let newResult=JSON.parse(result)// turn bank names to javascript object
            let bankSelect= document.querySelector('#bankName');
            for (let i = 0; i < newResult.data.length; i++) {
                // console.log(newResult.data[i])
                let options=`<option value="${newResult.data[i].code}"> ${newResult.data[i].name}</option>`
                bankSelect.innerHTML+=options//populate the option

                // // Sort Bank
                // let allOptions = $("#bankName option");
                // allOptions.sort(function (op1, op2) {
                //    var text1 = $(op1).text().toLowerCase();
                //    var text2 = $(op2).text().toLowerCase();
                //    return (text1 < text2) ? -1 : 1;
                // });
                // allOptions.appendTo("select");
            }   
        });    
       $("#addrec-bar").slideToggle()
   });


   //confirm account button
   $('#btn-confirm').on('click', ()=>{
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
            lookupResult=JSON.parse(result)   
            if(JSON.parse(result).status=="success"){
                $('#acctName').val(lookupResult.data.account_name);
                $('#acctName').css("font-weight", "600")
                $('#acctName').css('display', "block")
                $('#btn-addAccount').prop('disabled', false);
                $('#acctName').css('color', "#008a1e")
                
            }else{
                $('#acctName').val("Invalid Account Details");
                $('#acctName').css("font-weight", "600")
                $('#acctName').css('display', "block")
                $('#acctName').css('color', "#ff0000")
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
                // window.location.reload
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

});