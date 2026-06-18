import { DateTime } from 'luxon';

type Opaque<K, T> = T & { __TYPE__: K };

export type ISODate = Opaque<'ISODate', string>;

export type DateFormat =
    | 'DATETIME_FULL'
    | 'DATETIME_FULL_WITH_SECONDS'
    | 'DATETIME_HUGE'
    | 'DATETIME_HUGE_WITH_SECONDS'
    | 'DATETIME_MED'
    | 'DATETIME_MED_WITH_SECONDS'
    | 'DATETIME_SHORT'
    | 'DATETIME_SHORT_WITH_SECONDS'
    | 'DATE_FULL'
    | 'DATE_HUGE'
    | 'DATE_MED'
    | 'DATE_SHORT'
    | 'TIME_24_SIMPLE'
    | 'TIME_24_WITH_LONG_OFFSET'
    | 'TIME_24_WITH_SECONDS'
    | 'TIME_24_WITH_SHORT_OFFSET'
    | 'TIME_SIMPLE'
    | 'TIME_WITH_LONG_OFFSET'
    | 'TIME_WITH_SECONDS'
    | 'TIME_WITH_SHORT_OFFSET';

export type GenericDateTime = string | Date | DateTime | ISODate;

export function toDateTime(value: GenericDateTime): DateTime {
    if (value instanceof DateTime) {
        return value.toUTC();
    }

    if (value instanceof Date) {
        return DateTime.fromISO(value.toISOString());
    }

    try {
        return DateTime.fromISO(new Date(value).toISOString());
    } catch (e) {
        return DateTime.invalid(e instanceof Error ? e.message : '');
    }
}
