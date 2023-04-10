export default bool => {
  if (!bool) return;
  const dEl = document.createElement('div');
  dEl.id = 'debug';
  document.body.appendChild(dEl);
  // save the original console.log function
  var old_logger = console.log;
  // grab html element for adding console.log output
  var html_logger = document.getElementById('debug');
  // replace console.log function with our own function
  console.log = function (msg) {
    // first call old logger for console output
    old_logger.call(this, arguments);
    // check what we need to output (object or text) and add it to the html element.
    if (typeof msg == 'object') {
      html_logger.innerHTML +=
        '<p>' + (JSON && JSON.stringify ? JSON.stringify(msg) : msg) + '</p>';
    } else {
      html_logger.innerHTML += '<p>' + msg + '</p>';
    }
  };
};
