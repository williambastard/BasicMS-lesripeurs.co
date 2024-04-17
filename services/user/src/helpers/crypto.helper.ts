
import cryptoError from '../handlers/crypto.errors';
import * as crypto from 'node:crypto';

const algorithm = 'aes-256-cbc';
const key = Buffer.from("528bc2ee01f71702ded0eb0c0f4b2ee22af1169abd8dc88d3d8a8a9051e47289", "hex");  // Retrieve the environment variable 
const iv = Buffer.from("c1c1543b14c6535a39f2b6e3a826e5e5", "hex");


// Fonction pour convertir une durée en secondes

export abstract class cryptoHelper {

    // Fonction pour chiffrer les données avec AES-256 et inclure l'horodatage
    static encrypt(_password: string): string {
        try {
            const _cipher = crypto.createCipheriv(algorithm, key, iv);
            let _encrypted = _cipher.update(_password, 'utf-8', 'base64');
            _encrypted += _cipher.final('base64');
            return Buffer.from(_encrypted, 'utf-8').toString('hex');

        } catch (_error) {
            throw _error;
        }
    }

    // Fonction pour déchiffrer les données avec AES-256 et vérifier l'expiration
    static decrypt(_encryptedHexData: string): any {
        try {
            const _decipher = crypto.createDecipheriv(algorithm, key, iv);
            const _hexToUTF8 = Buffer.from(_encryptedHexData, 'hex').toString('utf-8');

            let _decrypted = _decipher.update(_hexToUTF8, 'base64', 'utf-8');
            _decrypted += _decipher.final('utf-8');

            // Retourne les données déchiffrées
            return _decrypted;

        } catch (error) {
            // Erreur de déchiffrement
            throw new cryptoError("The decryption of the token failed.")
        }
    }
}