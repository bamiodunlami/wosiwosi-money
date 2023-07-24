
$(document).ready(()=>{
    let poundsToNaira, sendCurrency, takeCurrency, currencyPair, arithmetic
    let sendAmount, takeAmount, totalAmount;
    let receiverJson, cardJson

    $("#rec-bar").hide()
    $("#pay-option").hide()        
    $("#summary").hide()

        
    let sendBox=$('#send-amount');
    let takeBox=$('#take-amount');


//get rate and execute
try{
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
                    let contii= "I warned"
                    console.log(contii.slice(0,4))
                   takeBox.val(totalAmount);
                    
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
            if(sendBox.val()>4.99){
                $('#btn-send').css('background-color', '#009933');
                $('#btn-send').prop('disabled', false);
            }else{
                $('#btn-send').css('background-color', '#8b8b8b');
                $('#btn-send').prop('disabled', true);
            }
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
                $(".takeAmount").text(`${takeCurrency} ${totalAmount}`)
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
    