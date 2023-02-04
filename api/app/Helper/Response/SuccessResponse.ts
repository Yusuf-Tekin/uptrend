
export default class SuccessResponse implements IResponse {
    
    message: string;
    code?:number;
    data?:Object;
    
    constructor(message:string,code?:number,data?:Object) {
        this.message = message;
        this.code = code ? code : 200;
        this.data = data;
    }
}