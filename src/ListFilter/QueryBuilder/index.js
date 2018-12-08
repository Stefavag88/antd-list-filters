import { getFieldType, getDateFieldFormat } from './../FieldHelper';
import moment from 'moment';
import { Parser } from 'expr-eval';

const operationsMap = {
    "<=": "checkIsBefore",
    ">=": "checkIsAfter",
    "in": "checkIsBetween",
    "==": "checkIsSame"
};
const parser = new Parser();

parser.functions.checkIsBefore = function (checkedDate, date, format) {
    return (moment(checkedDate, format).isSameOrBefore(moment(date, format)));
};
parser.functions.checkIsAfter = function (checkedDate, date, format) {
    return (moment(checkedDate, format).isSameOrAfter(moment(date, format)));
};
parser.functions.checkIsBetween = function (checkedDate, dateFrom, dateTo, format) {
    return (moment(checkedDate, format).isBetween(moment(dateFrom, format)), moment(dateTo, format));
};
parser.functions.checkIsSame = function (checkedDate, date, format) {
    return (moment(checkedDate, format).isSame(moment(date, format)));
};
parser.functions.isLike = function (first, second) {
    return first.includes(second);
}

export const prepareFilterQuery = (props, state) => {
    let { clientFilterBy } = state;
    let queryString = "( ";

    for (const entry of clientFilterBy.entries()) {

        console.log("ENTRY!", entry);
        let [key, val] = entry;

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

                const dateFormat = getDateFieldFormat(field);
                queryString += (val.includes(','))
                    ? parseDatesArray(key, val, dateFormat)
                    : parseSingleDate(key, val, dateFormat);
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