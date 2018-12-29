import { getFieldType, getDateFieldFormat } from './../FieldHelper';
import fnsFormatDate from 'date-fns/format';
import fnsParseDate from 'date-fns/parse';
import fnsIsAfter from 'date-fns/is_after';
import fnsIsEqual from 'date-fns/is_equal';
import fnsIsWithinRange from 'date-fns/is_within_range';
import fnsIsBefore from 'date-fns/is_before';
import { Parser } from 'expr-eval';

const operationsMap = {
    "<": "checkIsBefore",
    ">": "checkIsAfter",
    "in": "checkIsBetween",
    "==": "checkIsSame"
};
const parser = new Parser();

const prepareDate = (date, format) => fnsFormatDate(fnsParseDate(date), format);

parser.functions.checkIsBefore = (checkedDate, date, format) => fnsIsBefore(
    prepareDate(checkedDate, format), 
    prepareDate(date, format)
);

parser.functions.checkIsAfter = (checkedDate, date, format) => fnsIsAfter(
    prepareDate(checkedDate, format), 
    prepareDate(date, format)
);

parser.functions.checkIsBetween = (checkedDate, dateFrom, dateTo, format) => fnsIsWithinRange(
    prepareDate(checkedDate, format), 
    prepareDate(dateFrom, format), 
    prepareDate(dateTo, format)
);

parser.functions.checkIsSame = (checkedDate, date, format) => fnsIsEqual(
    prepareDate(checkedDate, format), 
    prepareDate(date, format)
);

parser.functions.isLike = (whole, part) => whole.includes(part);

export const prepareFilterQuery = (props, state) => {
    let { clientFilterBy } = state;
    let queryString = "( ";

    for (const [key,val] of clientFilterBy.entries()) {

        if (queryString.length > 2)
            queryString += " and (";

        const field = props.dataFields[key];
        if (getFieldType(field) === 'multiselect') {                  //For multi-select

            let innerQueryString = "";
            val.forEach(v => {
                if (innerQueryString.length > 0)
                    innerQueryString += " or ";

                innerQueryString += `d.${key} == "${v}"`;
            });
            innerQueryString += " )";
            queryString += innerQueryString;
        } else {
            if (getFieldType(field) === 'autocomplete')
                queryString += `d.${key} == "${val}"`;
            else if (getFieldType(field) === 'simplestring')
                queryString += `isLike(d.${key}, ${val})`;
            else if (getFieldType(field) === 'number')
                queryString += `d.${key} ${val}`;
            else if (getFieldType(field) === 'bool')
                queryString += `d.${key} == ${val}`;
            else if (getFieldType(field) === 'date') {

                const fnsFormatDate = getDateFieldFormat(field);
                queryString += (val.includes(','))
                    ? parseDatesArray(key, val, fnsFormatDate)
                    : parseSingleDate(key, val, fnsFormatDate);
            }
            queryString += " )";
        }
    }
    return queryString;
}

const parseDatesArray = (key, datesWithOperator, format) => {
    let dates = datesWithOperator.split(',');
    let splitOperator = dates[0].split(" ");
    let operator = splitOperator[0];
    let startDate = splitOperator[1];
    let endDate = dates[1];

    return `${operationsMap[operator]}(d.${key}, '${startDate}', '${endDate}', '${format}')`;
}

const parseSingleDate = (key, dateWithOperator, format) => {
    let splitOperator = dateWithOperator.split(" ");
    let operator = splitOperator[0];
    let date = splitOperator[1];

    return `${operationsMap[operator]}(d.${key}, '${date}', '${format}')`;
}

export const applyFilters = (dataSource, filterQuery) => {
    const queryFunction = parser.parse(filterQuery).toJSFunction('d');
    const filteredSource = dataSource.filter(d => queryFunction(d));

    return filteredSource;
} 