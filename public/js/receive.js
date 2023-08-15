$(document).ready(()=>{
    let receiveAmount = $('.receiveAmount');
    let equivalent = $('.equivalent')
    let total = $('#total')
    fetch('/rate', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    }).then(result => result.json()).then(response =>{
        let ngnTOGbp = JSON.parse(response.NGNTOGBP)
        $('#rate').text(ngnTOGbp)
        receiveAmount.on('keyup', ()=>{
        let balance = (receiveAmount.val() / ngnTOGbp)
        equivalent.val(balance.toFixed(2))
        // charges Cal
        let charges = (balance/1000)*3;
        // if (balance < 99.99) charges = 2
        // if(balance < 2) charges = 0
        total.text((balance - charges).toFixed(2))

    })
})
})