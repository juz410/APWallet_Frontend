import { Injectable } from '@angular/core';
import * as crypto from "crypto";
import * as CryptoJS from 'crypto-js';
import { AesKey } from '../interfaces/aes';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CryptosService {

  constructor(
    private storage: Storage
  ){ }

  async publicKeyEncrypt(data: string): Promise<string> {
    var publicKey: string;
    await this.storage.get('publicKey').then(
      resp => {
        publicKey = resp;
      }
    )

    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(data)
    )

    // Return: Base64 encoded encrypted text
    return encrypted.toString("base64");
}

aesEncryption(aesKey: AesKey, rawData: any){
  // const secretKey = cryaesKey.key
  const secretKey = CryptoJS.enc.Utf8.parse(aesKey.key);
  const iv = CryptoJS.enc.Utf8.parse(aesKey.iv)
  const encrypted = CryptoJS.AES.encrypt(rawData, secretKey, { iv: iv, mode: CryptoJS.mode.CBC});
  return encrypted.toString();
}

generateRandomString(){
  return CryptoJS.lib.WordArray.random(256 / 32).toString()
}
}
