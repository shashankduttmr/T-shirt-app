// base - Product.find()

class WhereClause{
    constructor(base, bigQ){
        //base is a Model and bigQ is a req.query
        this.base = base
        this.bigQ = bigQ
    }

    search(){
        //regex based search
        const searchword = this.bigQ.search ? {
            name:{
                $regex: this.bigQ.search,
                $options: 'i'
            }
        } : {
        }
        this.base = this.base.find({...searchword})
        return this
    }

    //for paginations//
    pager(resultpage){
        let currentPage = 1
        if(this.bigQ.page){
            currentPage = this.bigQ.page
        }
        let skipVal = resultpage * (currentPage -1)
        this.base = this.base.limit(resultpage).skip(skipVal)
        return this
    }

    //filtering based on search query
    filter(){
        const copyq = {...this.bigQ}

        // removing things which are not in use//
        delete copyq["search"]
        delete copyq["limit"]
        delete copyq["page"]

        //conversion bigq to string ==> copyQ
        let stringofcopyQ = JSON.stringify(copyq)

        ///injecting some Regex///b=boundaries/g=global for matching///

        stringofcopyQ = stringofcopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`)
        //converting string to a jsonObject//
        const JSONofCopy = JSON.parse(stringofcopyQ)
        this.base = this.base.find(JSONofCopy)
        return this
    }

}

module.exports = WhereClause