export const getFieldUIName = (fieldName) => {

    console.log("FIELDNAME!!", fieldName);

    const uiName = fieldName.uiName;

    if (!uiName)
        throw new Error(`ERROR: No uiName defined for field ${fieldName}`);

    return uiName;
}

export const getDateFieldFormat = (fieldName) => {

    const fieldType = getFieldType(fieldName);

    if (fieldType !== 'date')
        throw new Error(`ERROR: Trying to get date format for non-date field, ${fieldName}`);

    const dateFormat = fieldName.format;

    if (fieldType === 'date' && !dateFormat)
        throw new Error(`ERROR: No dateformat defined for field ${fieldName}`);

    return dateFormat;
}

export const getFieldType = (fieldName) => {

    return fieldName.type;
}

export const getFieldDataSource = (fieldName) => {

    const dataSource = fieldName.dataSource;

    if (!dataSource)
        console.warn(`WARNING: No dataSource property given to the field the field ${fieldName}.`);

    return dataSource;
}

export const getFieldKey = (dataFields, fieldName) => {

    const fieldKey = Object.keys(dataFields).find(key => key === fieldName);

    if (!fieldKey)
        throw new Error(`ERROR: No field defined with the name ${fieldName}.`);

    return fieldKey;
}

const discardNullUndefined = (setOfValues) => {

    if(setOfValues.has(null))
        setOfValues.delete(null);

    if(setOfValues.has(undefined))
        setOfValues.delete(undefined);

    if(setOfValues.has(""))
        setOfValues.delete("");

    return setOfValues;
}


export const generateFieldDataSourceValues = (listDataSource, fieldName) => {
   
    //TODO: CHECK THE PERFORMANCE OF THIS FUNCTION FOR LARGE INPUTS.(20-100)

    const retrievedValues = [
        ...listDataSource.map(record => record[fieldName])
    ];
   
    let distinctValues = new Set(retrievedValues); //KEEP UNIQUE VALUES

    distinctValues = discardNullUndefined(distinctValues);

    return distinctValues.size > 0 
        ? Array.from(distinctValues)
        : [];
}

