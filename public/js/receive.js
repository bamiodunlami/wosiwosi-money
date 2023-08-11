$(document).ready(()=>{
    let receiveAmount = $('.receiveAmount');
    let equivalent = $('.equivalent')
    receiveAmount.on('keyup', ()=>{
        let balance = receiveAmount.val() * 1180
        equivalent.val(balance)
    })

})