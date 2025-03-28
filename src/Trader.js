class Trader{
    constructor(accountType, details){
        this.accountType = accountType;
        Object.assign(this, details);
    }
}
export default Trader;