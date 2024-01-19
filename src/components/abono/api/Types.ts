export type FavoriteAbono = {
  ttpNumber: string;
  name: string;
};

export type AbonoType = {
  serialNumber: string;
  ttpNumber: string;
  createdAt: string;
  expireAt: string;
  contracts: Array<{
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
  }>;
};
