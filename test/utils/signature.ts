import type { IRubyscore_Achievement } from "@contracts/interfaces/IRubyscore_Achievement";
import type { AttestationPayloadStruct } from "@contracts/certificates/abstracts/AbstractModule";
import { HardhatEthersSigner } from "./signer";

interface RSV {
  r: string;
  s: string;
  v: number;
}

export interface Domain {
  name: string;
  version: string;
  chainId: string;
  verifyingContract: string;
}

interface IArrayItem {
  name: string;
  type: string;
}

export interface ITypes {
  [key: string]: IArrayItem[];
}

export const splitSignatureToRSV = (signature: string): RSV => {
  const r = "0x" + signature.substring(2).substring(0, 64);
  const s = "0x" + signature.substring(2).substring(64, 128);
  const v = parseInt(signature.substring(2).substring(128, 130), 16);

  return { r, s, v };
};

export const sign = async (
  domain: Domain,
  types: ITypes,
  message: IRubyscore_Achievement.MintParamsStruct | AttestationPayloadStruct,
  signer: HardhatEthersSigner,
): Promise<string> => {
  return await signer.signTypedData(domain, types, message);
};
