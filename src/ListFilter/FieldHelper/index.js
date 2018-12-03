export const getFieldUIName = (dataFields , fieldName) => {

    const uiName = dataFields[fieldName].uiName;
    
    if (!uiName)
        throw new Error(`ERROR: No uiName defined for field ${fieldName}`);

    return uiName;
}

export const getDateFieldFormat = (dataFields, fieldName) => {

    const fieldType = getFieldType(dataFields,fieldName);

    if (fieldType !== 'date')
        throw new Error(`ERROR: Trying to get date format for non-date field, ${fieldName}`);

    const dateFormat = dataFields[fieldName].format;
    
    if (fieldType === 'date' && !dateFormat)
        throw new Error(`ERROR: No dateformat defined for field ${fieldName}`);

    return dateFormat;
}

export const getFieldType = (dataFields, fieldName) => {

    return dataFields[fieldName].type;
}

export const getFieldDataSource = (dataFields, fieldName) => {

    const dataSource = dataFields[fieldName].dataSource;

    if (!dataSource)
        console.warn(`WARNING: Server Filter Mode defined and no dataSource given for the field the field ${fieldName}.`);

    return dataSource;
}

export const getFieldKey = (dataFields, fieldName) => {

    const fieldKey = Object.keys(dataFields).find(key => key === fieldName);

    if (!fieldKey)
        throw new Error(`ERROR: No field defined with the name ${fieldName}.`);

    return fieldKey;
}

export const getFieldNullValueReplacement = (dataFields, fieldName) => {

}


