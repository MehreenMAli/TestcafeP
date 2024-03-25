module.exports = class TimeError extends Error {
  constructor (message, status) {
    
    // Calling parent constructor of base Error class.
    super(message);
    this.name = "Out of time";
    // Capturing stack trace, excluding constructor call from it.
    Error.prepareStackTrace = function (err, stack) {
      return '';
    };
    
    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    Error.code = '';
    this.status = status || 500;
    
  }
};