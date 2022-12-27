


export default class Base{

    collectionName: string

    constructor(collectionName: string) {
        this.collectionName = collectionName
    }


    static getDatabase(){

    }


    static find(){
        return new Promise(async (resolve, reject)=>{


        })
    }

}

