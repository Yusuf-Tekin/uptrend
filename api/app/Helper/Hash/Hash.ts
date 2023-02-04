
import {createHash} from 'crypto'

export default class Hash {

    public static createHashString():string {
        return createHash('sha256').update("HASH").digest('hex');
    }

}