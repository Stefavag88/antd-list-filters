export const getFieldUIName = (fieldName) => {

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

export const getFieldDataSource = (fieldName, mandatory) => {

    const dataSource = fieldName.dataSource;

    if (!dataSource)
        console.warn(`WARNING: No dataSource property given to the field the field ${fieldName.uiName}.`);

    if(!dataSource && mandatory)
        throw new Error(`ERROR: property dataSource is required for field ${fieldName.uiName}`);

    if(dataSource && dataSource.length === 0 && mandatory)
        throw new Error(`WARNING: property dataSource for field ${fieldName.uiName} is passed but is an empty array. `);

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

