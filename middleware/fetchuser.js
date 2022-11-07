const jwt =require('jsonwebtoken')
const JWT_SECRET='12345-6789-098765'

const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using Valid Token"});
    }

try {
    const data =jwt.verify(token,JWT_SECRET);
    req.user=data.user;
    next();

} catch (error) {
    res.status(401).send({error:"Please Authenticate using valid Token"})
}
}

module.exports=fetchuser