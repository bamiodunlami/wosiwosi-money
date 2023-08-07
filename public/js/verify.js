window.addEventListener(
  'message',
  function(event) {
    console.log('Message received', event.data);

    if (event.data.eventType === 'SUCCESS') {
      window.location.href='/profile#kyc-bar'
    } else if (event.data.eventType === "ERROR") {
      window.location.href='/profile#kyc-bar'
     const errorCode = event.data.eventCode;
    }
  }
);  