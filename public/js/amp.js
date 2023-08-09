
$(document).ready(()=>{
    let poundsToNaira, sendCurrency, takeCurrency, currencyPair, arithmetic
    let sendAmount, takeAmount, totalAmount;
    let receiverJson, cardJson

    $("#rec-bar").hide()
    $("#pay-option").hide()        
    $("#summary").hide()
    $('#card-msg').hide()

    $("#addrec-bar").show();
    $('#card-details-bar').show()

        
    let sendBox=$('#send-amount');
    let takeBox=$('#take-amount');


//get rate and execute
try{

 //Load bank
// $('#accountNumber').on('focus', ()=>{
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
            for (let i = 0; i < newResult.length; i++) {
                // console.log(newResult.data[i])
                let options=`<option value="${newResult[i].code}"> ${newResult[i].name}</option>`
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
    // });

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
                window.location.reload()
            } 
        })
       });


 //Add card
    //Expiration card
    let expDate=$('#expiry-date')
    $(expDate).on('keyup', ()=>{
        if(expDate.val().length == 2){
            let expVal = expDate.val()
            expDate.val(expVal + '/')
        }
    });


// EXCHANGE MONEY
    fetch('/rate', {
        method:'GET',
        headers:{
            "Content-Type":"application/json",
        },
    }).then(res => res.text()).then((result)=>{
        result=JSON.parse(result);

        //detect which base currency customer pics
        $('#sendCurrency').on('change', ()=>{
            sendCurrency=$('#sendCurrency').val();
            takeCurrency=$('#takeCurrency').val();
            $("#baseFlag").attr("src", `https://flagcdn.com/${sendCurrency.slice(0,2).toLowerCase()}.svg`)
            currencyPair=`${sendCurrency}to${takeCurrency}`;
            compute();
        })
        sendBox.on('keyup', ()=>{
            sendCurrency=$('#sendCurrency').val();
            takeCurrency=$('#takeCurrency').val();
            currencyPair=`${sendCurrency}to${takeCurrency}`;
            compute();
        })
        
        //detect which quote currency customer pics
        $('#takeCurrency').on('change', ()=>{
            sendCurrency=$('#sendCurrency').val();
            takeCurrency=$('#takeCurrency').val();
            $("#takeFlag").attr("src", `https://flagcdn.com/${takeCurrency.slice(0,2).toLowerCase()}.svg`)
            currencyPair=`${sendCurrency}to${takeCurrency}`;
            compute();
        })
        takeBox.on('keyup', ()=>{
            sendCurrency=$('#sendCurrency').val();
            takeCurrency=$('#takeCurrency').val();
            currencyPair=`${sendCurrency}to${takeCurrency}`;
            compute();
        })
        

        //compute the exchange
        function compute(){
            switch(currencyPair){
                case "GBPtoNGN":
                    // console.log(currencyPair)
                    arithmetic=result[0].GBPTONGN;
                    sendAmount=sendBox.val();
                    totalAmount=sendAmount * arithmetic;
                   takeBox.val(totalAmount.toFixed(2));
                    
                    validate();
                    break;

                case "GBPtoGHS":
                    // console.log(currencyPair)
                    arithmetic=result[0].GBPTOGHS;
                    sendAmount=sendBox.val();
                    totalAmount=sendAmount * arithmetic;
                    takeBox.val(totalAmount);
                    validate();
                    break;

                case "GBPtoKEN":
                    // console.log(currencyPair)
                    arithmetic=result[0].GBPTOKEN;
                    sendAmount=sendBox.val();
                    totalAmount=sendAmount * arithmetic;
                    takeBox.val(totalAmount);
                    validate();
                    break;
                default:
                    break;
            }
        }
        
         //check imput validation
         function validate(){
            //sendBox validation
            if(sendBox.val()>4.99){
                $('#btn-send').css('background-color', '#009933');
                $('#btn-send').prop('disabled', false);
            } else{
                $('#btn-send').css('background-color', '#8b8b8b');
                $('#btn-send').prop('disabled', true);
            }

            //takeBox Validation
            // if(sendBox.val()>4.99){
            //     $('#btn-send').css('background-color', '#009933');
            //     $('#btn-send').prop('disabled', false);
            // }else{
            //     $('#btn-send').css('background-color', '#8b8b8b');
            //     $('#btn-send').prop('disabled', true);
            // }
         }
   
    });
        
    //get reciver option
    $("#btn-send").on('click', ()=>{
        $("#exchange-bar").hide()
        $("#tran").hide()
        $("#rec-bar").show()
    });

    $("#back").on('click', ()=>{
        $("#exchange-bar").show()
        $("#tran").show()
        $("#rec-bar").hide()
        $("#pay-option").hide()
    });

    //select receiver and move to card
    let receiverDetailts=$(".receiver");
    for(let i=0; i<receiverDetailts.length; i++){
        let acctName= $(".acctName")
        let acctNumber= $(".acctNumber")
        let bank= $(".bank")
        $(receiverDetailts[i]).on('click', ()=>{
            receiverJson={
                accountName:$(acctName[i]).text(),
                accountNumber:$(acctNumber[i]).text(),
                bank:$(bank[i]).text()
            }

            $("#rec-bar").hide()
            $("#pay-option").show()
        });
    }

    $("#back-again").on('click', ()=>{
        $("#rec-bar").show()
        $("#pay-option").hide()
    });

    //got to final preview page before sending
    let paymentOption=$(".paymentOption");
    for(let i=0; i<paymentOption.length; i++){
        let cardName= $(".cardName")
        let cardNumber= $(".cardNumber")
        $(paymentOption[i]).on('click', ()=>{
            cardJson={
                cardName:$(cardName[i]).text(),
                cardEndingNumber:$(cardNumber[i]).text(),
            }
            $("#pay-option").hide()
            $("#summary").show()

                // preview page
                $('.sendAmount').text(`${sendCurrency} ${sendAmount}`)
                $(".takeAmount").text(`${takeCurrency} ${totalAmount.toFixed(2)}`)
                $(".cAcctName").text(receiverJson.accountName);
                $(".cAcctNumber").text(receiverJson.accountNumber);
                $(".cBank").text(receiverJson.bank);
                $(".cCardName").text(cardJson.cardName);
                $(".cCardNumber").text(cardJson.cardEndingNumber);
                });
    }


    $("#back-again").on('click', ()=>{
        $("#rec-bar").show()
        $("#pay-option").hide()
    });

    // Back from preview page
    $("#back-last").on('click', ()=>{
        $("#summary").hide()
        $("#pay-option").show()
    });

    // Preview page Send Button
        $('#send-money').on('click', ()=>{
            $('#send-money').prop('disabled', true);
            $("#rec-bar").prop('disabled', true)
            $('#send-money').text('process...');
            let reference= String(Math.random()*4)
            let ref= reference.slice(2);
            console.log(ref)
            exchangeValues={
               currencyPair:currencyPair,
               sendCurrency: sendCurrency,
               takeCurrency: takeCurrency,
               sendAmount: sendAmount*100,//multiply by 100 to give 1 pound per figure inpute
               takeAmount:totalAmount,
               Base: arithmetic,
               receiverName:receiverJson.accountName,
               accountNumber:receiverJson.accountNumber,
               bankName:receiverJson.bank,
               nameOnPaymentCard:cardJson.cardName,
               cardEnding:cardJson.cardEndingNumber,
               ref:`w0s${ref}`
            }
        
            //send the data to server
            let option= {
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(exchangeValues)
             }  
            fetch('/exchange', option)
            .then(response => response.text())
            .then((result) => {
                if(result=="false"){
                    window.location.href='/fail'
                }else if(result== "true"){
                    window.location.href='/success'
                }
            })
         });
     // ::::::::::::::::::::::::::::

     }catch(err){

    }

});
    