module.exports = function(req,res,next){
    if(req.session.user === null || typeof req.session.user === 'undefined'){
        return res.redirect('/login');
    }
    next();
}