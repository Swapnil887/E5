
const validate = (req,res,next)=>{
    var ip = req.params.ip;
    try {
        var key = check(ip)
        if(key){
            next()
        }else{
            res.send("wrong ip address")
        }
    } catch (error) {
        console.log(error)
        res.send("something wrong while validate")
    }
}


function check(x){
    var arr = x.split('.')
    
    console.log(arr)
    
    if(arr.length==4)
    {
        for(var i=0;i<4;i++)
        {
            
            if(+arr[i]<=255 && +arr[i]>=0)
            {
                if(arr[i].length<=3){
                    var pio = 0
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }
        return true
    }
    }


    module.exports = {validate}
