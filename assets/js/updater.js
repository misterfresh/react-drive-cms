let source = new EventSource('/stream')

source.addEventListener(
  'message',
  function(event) {
    console.log('updating!', event.data)
    location.reload(true)
  },
  false
)
