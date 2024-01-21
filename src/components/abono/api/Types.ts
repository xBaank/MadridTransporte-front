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

export type TtpResponse = {
  status: Status;
  capdu: string[];
  balance: Balance;
  titleList: TitleList;
  updateReason: null;
  uniqueIdTransactionMS: string;
  uniqueIdTransactionLS: string;
};

export type Balance = {
  desfireSerial: string;
  now: Date;
  controlDigit: string;
  orderCode: string;
  cardOrderNumber: string;
  initAppDate: Date;
  finishAppDate: Date;
  blockedApp: boolean;
  groupName: Name;
  groupShortName: Name;
  groupId: number;
  initGroupDate: Date;
  finishGroupDate: Date;
  profiles: Profile[];
  issuerId: string;
  manufacturerId: string;
  prepersoId: string;
  persoId: string;
  cardNumber: string;
  titTemp: TitTemp | null;
  titMV3: TitMV | null;
  titMV1: TitMV | null;
  titMV2: TitMV | null;
};

export type Name = "Joven" | "Normal";

export type Profile = {
  profileId: number;
  profileName: Name;
  initProfileDate: Date;
  finishProfileDate: Date;
};

export type TitMV = {
  name: string;
  titleId: string;
  chargeState: string;
  profileName: string;
  profileId: string;
  blocked: boolean;
  canBlock: boolean;
  validityZones: string;
  fedtIndex: number;
  purchaseChargeDate: Date;
  operators: string[];
  lastValidationDate: Date;
  lastValidationPoint: string;
  lastUserQtyInsp: number;
  trips: string;
  suplementInfo: null;
  fedtindex: number;
};

export type TitTemp = {
  name: string;
  titleId: string;
  chargeState: string;
  profileName: Name;
  profileId: string;
  blocked: boolean;
  canBlock: boolean;
  validityZones: string;
  fedtIndex: number;
  purchaseChargeDate: Date;
  operators: string[];
  lastValidationDate: Date;
  lastValidationPoint: string;
  lastUserQtyInsp: number;
  initChargeDate: Date;
  finishChargeDate: Date;
  firstDateValCharge: Date;
  finalDateValCharge: Date | null;
  purchaseRechargeDate: null;
  initRechargeDate: null;
  finishRechargeDate: null;
  firstDateValRecharge: null;
  finalDateValRecharge: null;
  validityDays: number;
  rechargeState: string;
  chargeValidated: null;
  rechargeValidated: null;
  fedtindex: number;
};

export type Status = {
  code: string;
  description: any[];
};

export type TitleList = {
  controlDigit: string;
  cardName: string;
  groupId: string;
  groupName: Name;
  groupShortName: Name;
  items: null;
  families: Family[];
};

export type Family = {
  name: string;
  familyId: string;
  titles: Title[];
};

export type Title = {
  profileId: string;
  profileName: Name;
  titleId: string;
  titleName: string;
  fare: number;
  maxItems: number;
  tripsPerItem: number;
  supplement: null;
  cardFare: number;
  validityDays: number;
  validityZones: null;
  titleChargingStatus: "AVAILABLE_COMPATIBLE";
  titleConstraints: null;
};

// To parse this data:
//
//   import { Convert, TTPResponse } from "./file";
//
//   const tTPResponse = Convert.toTTPResponse(json);
