window.addEventListener(
  'message',
  function(event) {
    console.log('Message received', event.data);
  if (event.data.eventType === 'SUCCESS') {
    window.location.href='/idv'
  } else if (event.data.eventType === "ERROR") {
    window.location.href='/idv'
     const errorCode = event.data.eventCode;
    }
  }
);