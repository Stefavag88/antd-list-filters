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

//CONVENTION MADE: For ALL methods, if valuesSource is null 
//then we get the values automatically(distinct values)
//for controls that support it..

export const buildNumberFilters = (name, field, valuesSource, setFilterFunc) => {
    let min, max;


    if (valuesSource && valuesSource.length > 1) {
        min = Math.min(valuesSource);
        max = Math.max(valuesSource);
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

export const buildDateFilters = (name, field, valuesSource, setDateFilterFunc) => {

    return (
        <DateFilter
            key={`date-filter-${name}`}
            format={getDateFieldFormat(field)}
            name={getFieldUIName(field)}
            onChange={state => setDateFilterFunc(state, name)}
        />
    );
};

export const buildBooleanFilters = (name, field, valuesSource, setBooleanFiltersFunc) => {
    return (
        <BooleanFilter
            key={`boolean-filter-${name}`}
            name={getFieldUIName(field)}
            onChange={state => setBooleanFiltersFunc(state, name)}
        />
    );
};

export const buildMultiSelectFilters = (name, field, valuesSource, setMultiSelectFiltersFunc) => {

    const selectionValues = valuesSource.length > 0 
    ? ( valuesSource.map((val, index) => <Option key={index}> {val} </Option>)) 
    : ( <Option key={`${name}-empty`}> - </Option> );

    return (
        <MultiSelectFilter
            key={`multiselect-filter-${name}`}
            name={getFieldUIName(field)}
            dataSource={selectionValues}
            onChange={state => setMultiSelectFiltersFunc(state, name, valuesSource)}
        />
    );
};

export const buildStringInputFilters = (name, field, valuesSource, setStringInputFilterFunc) => {

    return (
        <StringInputFilter
            key={`stringInput-filter-${name}`}
            name={getFieldUIName(field)}
            onChange={state => setStringInputFilterFunc(state, name)}
        />
    );
};

export const buildAutocompleteFilters = (name, field, valuesSource, setStringInputFiltersFunc) => {

    return (
        <AutoCompleteFilter
            key={`autocomplete-filter-${name}`}
            name={getFieldUIName(field)}
            onChange={state => setStringInputFiltersFunc(state, name)}
            dataSource={valuesSource}
        />
    );
};
