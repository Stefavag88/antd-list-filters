import { getFieldUIName, getDateFieldFormat, getFieldNullValueReplacement } from '../FieldHelper';
import NumberFilter from '../Components/NumberFilter/index';
import BooleanFilter from '../Components/BooleanFilter/index';
import DateFilter from '../Components/DateFilter/index';
import StringInputFilter from '../Components/StringInputFilter/index';
import AutoCompleteFilter from '../Components/AutoCompleteFilter/index';
import MultiSelectFilter from '../Components/MultiselectFilter/index';

export const buildNumberFilters = (name, dataFields, valuesSource = new Set(), setFilterFunc) => {
    let min, max;

    const dataSource = this.determineFieldDataSource(valuesSource, name);

    if (dataSource && dataSource.length > 1) {
        min = Math.min(dataSource);

        max = Math.max(dataSource);
    }

    return (
        <NumberFilter
            key={`number-filter-${name}`}
            name={getFieldUIName(dataFields, name)}
            onChange={state => setFilterFunc(state, name)}
            min={min}
            max={max}
        />
    );
};

export const buildDateFilters = (name, dataFields, setDateFilterFunc) => {
    return (
        <DateFilter
            key={`date-filter-${name}`}
            format={getDateFieldFormat(dataFields, name)}
            name={getFieldUIName(dataFields, name)}
            onChange={state => setDateFilterFunc(state, name)}
        />
    );
};

export const buildBooleanFilters = (name, dataFields, setBooleanFiltersFunc) => {
    return (
        <BooleanFilter
            key={`boolean-filter-${name}`}
            name={getFieldUIName(dataFields, name)}
            onChange={state => setBooleanFiltersFunc(state, name)}
        />
    );
};

export const buildMultiSelectFilters = (name, dataFields, valuesSource, setMultiSelectFiltersFunc) => {
    const stringValues = this.determineFieldDataSource(valuesSource, name);

    const selectionValues =
        stringValues.length > 0 ? (
            stringValues.map((val, index) => <Option key={index}> {val} </Option>)
        ) : (
                <Option key={`${name}-empty`}> - </Option>
            );

    return (
        <MultiSelectFilter
            key={`multiselect-filter-${name}`}
            name={getFieldUIName(dataFields, name)}
            dataSource={selectionValues}
            onChange={state => setMultiSelectFiltersFunc(state, name, stringValues)}
        />
    );
};

export const buildStringInputFilters = (name, dataFields, setStringINputFilterFunc) => {
    return (
        <StringInputFilter
            key={`stringInput-filter-${name}`}
            name={getFieldUIName(this.props, name)}
            onChange={state => setStringInputFilterFunc(state, name)}
        />
    );
};

export const buildAutocompleteFilters = (name, dataFields, valuesSource, setStringINputFiltersFunc) => {
    const dataSource = this.determineFieldDataSource(valuesSource, name);

    return (
        <AutoCompleteFilter
            key={`autocomplete-filter-${name}`}
            name={getFieldUIName(dataFields, name)}
            onChange={state => setStringInputFiltersFunc(state, name)}
            dataSource={dataSource}
        />
    );
};

determineFieldDataSource = (mode, name, dataFields, valuesSource) => {
    const dataSource =
        mode === "client"
            ? tryGetValuesSource(valuesSource, name, dataFields)
            : getFieldDataSource(dataFields, name)
                ? getFieldDataSource(dataFields, name)
                : tryGetValuesSource(valuesSource, name, dataFields);

    return dataSource;
};

tryGetValuesSource = (valuesSource, name, dataFields) => {

    if (!valuesSource)
        console.error(`ERROR: Failed to get distinct values source from client data for field: ${name}`);

    const valuesArray = Array.from(valuesSource);

    let withoutNulls = [];

    if (getFieldNullValueReplacement(dataFields, name)) {
        withoutNulls = valuesArray.map(value =>
            value === null
                ? getFieldNullValueReplacement(dataFields, name)
                : value
        );

        return withoutNulls;
    }

    return valuesArray;
};