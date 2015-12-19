module.exports = function(err, req, res, next) {
  if(err){
    console.log(err);
  }
  next();
}
