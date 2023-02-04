
export default class ErrorResponse implements IResponse {
    
    message: string;
    code?:number;
    
    constructor(message:string,code?:number) {
        this.message = message;
        this.code = code ? code : 500;
    }
}