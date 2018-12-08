import React from 'react';
import {Select} from 'antd';
import { getFieldUIName, getDateFieldFormat, getFieldNullValueReplacement, getFieldDataSource } from '../FieldHelper';
import NumberFilter from '../Components/NumberFilter/index';
import BooleanFilter from '../Components/BooleanFilter/index';
import DateFilter from '../Components/DateFilter/index';
import StringInputFilter from '../Components/StringInputFilter/index';
import AutoCompleteFilter from '../Components/AutoCompleteFilter/index';
import MultiSelectFilter from '../Components/MultiselectFilter/index';

const Option = Select.Option;

export const buildNumberFilters = (name, field, valuesSource = new Set(), setFilterFunc) => {
    let min, max;

    const dataSource = determineFieldDataSource(valuesSource, name);

    if (dataSource && dataSource.length > 1) {
        min = Math.min(dataSource);

        max = Math.max(dataSource);
    }

    return (
        <NumberFilter
            key={`number-filter-${name}`}
            name={getFieldUIName(field)}
            onChange={state => setFilterFunc(state, name)}
            min={min}
            max={max}
        />
    );
};

export const buildDateFilters = (name, field, setDateFilterFunc) => {

    return (
        <DateFilter
            key={`date-filter-${name}`}
            format={getDateFieldFormat(field)}
            name={getFieldUIName(field)}
            onChange={state => setDateFilterFunc(state, name)}
        />
    );
};

export const buildBooleanFilters = (name, field, setBooleanFiltersFunc) => {
    return (
        <BooleanFilter
            key={`boolean-filter-${name}`}
            name={getFieldUIName(field)}
            onChange={state => setBooleanFiltersFunc(state, name)}
        />
    );
};

export const buildMultiSelectFilters = (name, field, valuesSource, setMultiSelectFiltersFunc) => {
    const stringValues = determineFieldDataSource(valuesSource, name);

    const selectionValues =
        stringValues.length > 0 ? (
            stringValues.map((val, index) => <Option key={index}> {val} </Option>)
        ) : (
                <Option key={`${name}-empty`}> - </Option>
            );

    return (
        <MultiSelectFilter
            key={`multiselect-filter-${name}`}
            name={getFieldUIName(field)}
            dataSource={selectionValues}
            onChange={state => setMultiSelectFiltersFunc(state, name, stringValues)}
        />
    );
};

export const buildStringInputFilters = (name, field, setStringInputFilterFunc) => {

    return (
        <StringInputFilter
            key={`stringInput-filter-${name}`}
            name={getFieldUIName(field)}
            onChange={state => setStringInputFilterFunc(state, name)}
        />
    );
};

export const buildAutocompleteFilters = (name, field, valuesSource, setStringInputFiltersFunc) => {
    const dataSource = determineFieldDataSource(valuesSource, name);

    return (
        <AutoCompleteFilter
            key={`autocomplete-filter-${name}`}
            name={getFieldUIName(field)}
            onChange={state => setStringInputFiltersFunc(state, name)}
            dataSource={dataSource}
        />
    );
};

const determineFieldDataSource = (mode, name, valuesSource) => {
    const dataSource =
        mode === "client"
            ? tryGetValuesSource(valuesSource, name)
            : getFieldDataSource(name)
                ? getFieldDataSource(name)
                : tryGetValuesSource(valuesSource, name);

    return dataSource;
};

const tryGetValuesSource = (valuesSource, name) => {

    if (!valuesSource)
        console.error(`ERROR: Failed to get distinct values source from client data for field: ${name}`);

    const valuesArray = Array.from(valuesSource);

    let withoutNulls = [];

    if (getFieldNullValueReplacement(name)) {
        withoutNulls = valuesArray.map(value =>
            value === null
                ? getFieldNullValueReplacement(name)
                : value
        );

        return withoutNulls;
    }

    return valuesArray;
};