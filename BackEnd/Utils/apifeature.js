class ApiFeature{

    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }


    search(){

        const keyword = this.queryStr.keyword ?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
            }
        }:{}


        
        this.query=this.query.find({...keyword});

        return this;
    }


    filter(){
        const querystrcopy = {...this.queryStr};

        const removefields=["keyword","page","limit"];

        removefields.forEach(key=> delete querystrcopy[key]);

        //filter price and rating 

        let qstr = JSON.stringify(querystrcopy);
        qstr = qstr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`);



        console.log(qstr);

        this.query = this.query.find(JSON.parse(qstr));

        return this;
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage-1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;

    }
}

module.exports=ApiFeature;