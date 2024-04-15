
import cryptoError from '../handlers/crypto.errors';
import * as crypto from 'crypto';
import momentTz from "moment-timezone";

const algorithm = 'aes-256-cbc';
const key = Buffer.from("528bc2ee01f71702ded0eb0c0f4b2ee22af1169abd8dc88d3d8a8a9051e47289", "hex");  // Retrieve the environment variable 
const iv = Buffer.from("c1c1543b14c6535a39f2b6e3a826e5e5", "hex");
const now = momentTz().utc()
const nowMs = now.valueOf();

// Fonction pour convertir une durée en secondes
function parseDuration(duration: string): number {
    let value = 3600;
    const match = duration!.match(/^(\d+(?:\s*(year|years|an|ans|month|months|mois|mo|week|weeks|semaine|semaines|we|day|days|jour|jours|d|j|hour|hours|heure|heures|h|minute|minutes|m|second|seconds|seconde|secondes|sec|s))?)$/);

    if (match !== null) {
        const unitGroupCoefficient: { [key: string]: number }[] = [
            {
                'ye': 3600 * 24 * 365,
                'mo': 3600 * 24 * 30,
                'we': 3600 * 24 * 7,
                'da': 3600 * 24,
                'ho': 3600,
                'mi': 60,
                'se': 1
            }
        ];
        const unitGroup: { [key: string]: string[] | number }[] = [
            {
                'ye': ["year", "years", "an", "ans"],
                'mo': ["month", "months", "mois", "mo"],
                'we': ["week", "weeks", "semaine", "semaines", "we", "se"],
                'da': ["day", "days", "jour", "jours", "d", "j"],
                'ho': ["hour", "hours", "heure", "heures", "h"],
                'mi': ["minute", "minutes", "m"],
                'se': ["second", "seconds", "seconde", "secondes", "sec", "s"],
            }
        ];
        const [, valueStr, unit] = match!;
        let value = parseInt(valueStr);

        for (let i = 0; i < unitGroup.length; i++) {
            const names = unitGroup[i][unit.toLowerCase()] as string[];
            if (names) {
                const coefficient = unitGroupCoefficient[0][unit.toLowerCase()];
                if (coefficient) {
                    value = value * coefficient;
                }
            }
        }
    }
    return value;
}

export abstract class cryptoHelper {

    // Fonction pour chiffrer les données avec AES-256 et inclure l'horodatage
    static encrypt(dataObject: { userId: number, expireIn: string }): string {
        try {
            // Ajoute l'horodatage actuel à la donnée
            const timestamp = nowMs + parseDuration(dataObject.expireIn);
            console.log(now.tz('Europe/Paris').format());
            // Convertit l'objet en chaîne JSON
            const data = JSON.stringify({ userId: dataObject.userId, lifeTime: dataObject.expireIn, expireAt: timestamp, expireDate: momentTz(timestamp).tz('Europe/Paris').format(), createAt: now.tz('Europe/Paris').format() });

            const cipher = crypto.createCipheriv(algorithm, key, iv);

            let encrypted = cipher.update(data, 'utf-8', 'base64');
            encrypted += cipher.final('base64');

            return Buffer.from(encrypted, 'utf-8').toString('hex');

        } catch (error) {
            // Erreur de chiffrement
            throw new cryptoError(error!.toString());
        }
    }

    // Fonction pour déchiffrer les données avec AES-256 et vérifier l'expiration
    static decrypt(encryptedHexData: string): any {
        try {
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
            const hexToUTF8 = Buffer.from(encryptedHexData, 'hex').toString('utf-8');
            let decrypted = decipher.update(hexToUTF8, 'base64', 'utf-8');
            decrypted += decipher.final('utf-8');


            // Vérifie si le token a expiré
            const json = JSON.parse(decrypted);

            console.log(json);
            const expiresIn = json.expireAt - nowMs;

            if (expiresIn <= 0) {
                // Token expiré
                throw new Error(`Token has been expired since ${momentTz(json.expireAt).tz('Europe/Paris').format()}.`)
            }

            // Retourne les données déchiffrées
            return json;

        } catch (error) {
            // Erreur de déchiffrement
            throw new cryptoError("The decryption of the token failed.")
        }
    }
}