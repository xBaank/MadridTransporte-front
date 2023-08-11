export type AbonoType = {
    serialNumber: string;
    ttpNumber: string;
    createdAt: string;
    expireAt: string;
    contracts: {
        contractCode: string;
        contractName: string;
        chargeDate: string;
        firstUseDateLimit: string;
        firstUseDate: string | null;
        lastUseDate: string | null;
        useDays: number;
        leftDays: number;
        charges: number;
        remainingCharges: number;
    }[]
}