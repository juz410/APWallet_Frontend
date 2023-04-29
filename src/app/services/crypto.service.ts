
// import * as crypto from "crypto";
// import * as CryptoJS from 'crypto-js';
// import { AesKey } from "../interfaces/aes";
// import { Storage } from "@ionic/storage-angular";

// export function publicKeyEncrypt(data: string): string {
//     const encrypted = crypto.publicEncrypt(
//         {
//             key: publicKey,
//             padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//             oaepHash: "sha256",
//         },
//         Buffer.from(data)
//     )

//     // Return: Base64 encoded encrypted text
//     return encrypted.toString("base64");
// }

// export function   aesEncryption(aesKey: AesKey, rawData: any){
//     // const secretKey = cryaesKey.key
//     const secretKey = CryptoJS.enc.Utf8.parse(aesKey.key);
//     const iv = CryptoJS.enc.Utf8.parse(aesKey.iv)
//     const encrypted = CryptoJS.AES.encrypt(rawData, secretKey, { iv: iv, mode: CryptoJS.mode.CBC});
//     return encrypted.toString();
//   }


// // export async function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
// //     // Generate a new RSA key pair with a 2048-bit modulus
// //     const keyPair = await window.crypto.subtle.generateKey(
// //       {
// //         name: "RSA-OAEP",
// //         modulusLength: 2048,
// //         publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
// //         hash: "SHA-256"
// //       },
// //       true,
// //       ["encrypt", "decrypt"]
// //     );
  
// //     // Export the public and private keys as PEM-encoded strings
// //     const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
// //     const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  
// //     // Convert the exported keys to base64-encoded strings
// //     const publicKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(publicKey)));
// //     const privateKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(privateKey)));
  
// //     console.log("publicKeyBase64", publicKeyBase64)
// //     console.log("privateKeyBase64", privateKeyBase64)
// //     // Return the base64-encoded public and private keys
// //     return { publicKey: `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64}\n-----END PUBLIC KEY-----`, privateKey: `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64}\n-----END PRIVATE KEY-----` };
// //   }
  