
import momentTz from "moment-timezone";

const now = momentTz().utc();

export abstract class timeHelper {
    static _defaultExpiryInUnit: string = "d";
    static _defaultExpiryInValue: number = 1;
    static _defaultExpiryIn: string = `${timeHelper._defaultExpiryInValue} ${timeHelper._defaultExpiryInUnit}`;

    static nowInSeconds = momentTz().valueOf();

    private static unitGroupCoefficient: { [key: string]: number } = {
        'y': 3600 * 24 * 365,
        'M': 3600 * 24 * 30,
        'w': 3600 * 24 * 7,
        'd': 3600 * 24,
        'h': 3600,
        'm': 60,
        's': 1
    };

    private static unitGroup: { [key: string]: string[] } = {
        'y': ["year", "years", "an", "ans", "a", "y"],
        'M': ["month", "months", "mois", "mo"],
        'w': ["week", "weeks", "semaine", "semaines", "we", "se"],
        'd': ["day", "days", "jour", "jours", "d", "j"],
        'h': ["hour", "hours", "heure", "heures", "h"],
        'm': ["minute", "minutes", "m"],
        's': ["second", "seconds", "seconde", "secondes", "sec", "s"],
    };
    private static match(_duration: string): RegExpMatchArray {
        const _regexReturn = _duration!.replaceAll(/[^a-zA-Z0-9]/g, '').match(/^(\d+)([A-z]+)?$/);
        return _regexReturn!;
    }

    static getExpiryDate(_expiryTimeInSeconds: number) {
        return momentTz(_expiryTimeInSeconds).format();
    }
    static getNowDate(_timeZone: string) {
        return now.tz(_timeZone).format();
    }

    static getExpiryDateInseconds(_duration: string): number {

        const [_, valueUnit, unit] = timeHelper.match(_duration);

        const valueToAdd = parseInt(valueUnit) as number;
        let indexName = Object.keys(timeHelper.unitGroup).map(keyGroup => timeHelper.unitGroup[keyGroup].find(k => k === unit) ? keyGroup : undefined).find(x => x !== undefined) ?? timeHelper._defaultExpiryInUnit
        return momentTz().add(valueToAdd, indexName as momentTz.unitOfTime.DurationConstructor).valueOf();
    }

    static cookieDuration(_duration: string): number {

        const [_, valueUnit, unit] = timeHelper.match(_duration);

        let indexName = Object.keys(timeHelper.unitGroup).map(keyGroup => timeHelper.unitGroup[keyGroup].find(k => k === unit) ? keyGroup : undefined).find(x => x !== undefined) ?? timeHelper._defaultExpiryInUnit
        console.log(unit);
        const coefficient = timeHelper.unitGroupCoefficient[indexName];

        return parseInt(valueUnit) * coefficient;
    }

}