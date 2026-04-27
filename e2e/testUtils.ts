import { rankAbbreviations } from "../src/lib/rankAbbreviations"

export function extractName(person: Record<string, unknown>){
    const prefix = person.prefix ? `${person.prefix} ` : '';
    const abbrev = person.rank ? `${rankAbbreviations[`${person.rank}`] ?? person.rank} ` : '';
    const name = `${person.first_name} ${person.middle_name ? `${person.middle_name} ` : '' }${person.last_name}${person.suffix ? ` ${person.suffix}` : '' }`;
    return {
        link : person.personnel_type == 'military' ? `${abbrev}${name}` : `${prefix}${name}`,
        displayName : `${prefix}${name}`,
    }
}