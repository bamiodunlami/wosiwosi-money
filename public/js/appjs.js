
$(document).ready(()=>{
let poundsToNaira, sendCurrency, takeCurrency, currencyPair, arithmetic
let sendAmount, takeAmount, totalAmount;

let sendBox=$('#send-amount');
let takeBox=$('#take-amount');

$('#btn-send').on('click', ()=>{
    window.location.href='/dashboard'
})


//get rate and execute
try{
    fetch('/rate', {
        method:'GET',
        headers:{
            "Content-Type":"application/json",
        },
    }).then(res => res.text()).then((result)=>{
        result=JSON.parse(result);
        // console.log(result)

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
            if(sendBox.val()>9.99){
                $('#btn-send').css('background-color', '#f6a800');
                $('#btn-send').prop('disabled', false);
            } else{
                $('#btn-send').css('background-color', '#8b8b8b');
                $('#btn-send').prop('disabled', true);
            }

            //takeBox Validation
            if(sendBox.val()>9.99){
                $('#btn-send').css('background-color', '#009933');
                $('#btn-send').prop('disabled', false);
            }else{
                $('#btn-send').css('background-color', '#8b8b8b');
                $('#btn-send').prop('disabled', true);
            }
         }
   
    });

}catch(err){

}

});
