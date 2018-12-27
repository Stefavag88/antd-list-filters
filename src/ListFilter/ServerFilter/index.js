import React from "react";
import PropTypes from "prop-types";
import { Drawer, Popover, Icon, Card, Button, Checkbox, Tooltip } from "antd";
import SearchAllBar from "../Components/SearchAllBar";
import { getFieldKey, getFieldType, getFieldUIName, getFieldDataSource } from "../FieldHelper";
import { buildBooleanFilters, buildAutocompleteFilters, buildDateFilters, buildMultiSelectFilters, buildNumberFilters, buildStringInputFilters } from '../FilterBuilder';

class ServerFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSearching: false,
            isFilterEnabled: false,
            dataSource: this.props.dataSource,
            clientFilterBy: new Map(),
            ServerFilterBy: [],
            FilteredData: [],
            visibleFilters: new Map(),
            filtersContent: new Map(),
            filtersDrawerVisible: false
        };

        this.inputSearchRef = React.createRef();
    }

    componentDidMount(){
        const { autoBuildFilters } = this.props;

        if (autoBuildFilters)
            this.autoBuildFilterContent();
    };

    resetDataSource(){
        this.setState((state, props) => {
            return { dataSource: props.dataSource };
        });
    };

    mapFiltersToServer(){
        let serverFilters = [];

        for (let entry of this.state.clientFilterBy) {
            const [key, value] = entry;
            const field = this.props.dataFields[key];

            const serverFilter = {
                Name: key,
                Type: getFieldType(field),
                Values: Array.isArray(value) ? value : [value]
            };
            serverFilters.push(serverFilter);
        }
        return serverFilters;
    };

    discardExcludedFields(fieldNames){
        let fieldNamesExcluded = [...fieldNames];

        const { excludeFields } = this.props;

        if (excludeFields && excludeFields.length > 0) {
            fieldNamesExcluded = fieldNamesExcluded.filter(
                fieldName => !excludeFields.includes(fieldName)
            );
        }

        return fieldNamesExcluded;
    };

    decideFiltersToBuild(){
        const { dataSource } = this.props;
        const { visibleFilters } = this.state;

        if (visibleFilters.size > 0) {
            return Array.from(visibleFilters.keys());
        } else {
            const allfieldNames = Object.keys(dataSource[0]);
            return this.discardExcludedFields(allfieldNames);
        }
    }

    autoBuildFilterContent(){
        const { dataFields } = this.props;
        const filtersToBuild = this.decideFiltersToBuild();

        let filtersContent = new Map();

        filtersToBuild.forEach(name => {
            const field = dataFields[name];
            const fieldDataSource = getFieldDataSource(dataFields[name]);
            
            if (field.type === "autocomplete") {
                filtersContent.set(name,
                    buildAutocompleteFilters(name, field, fieldDataSource, this.setStringInputFilter)
                );
            }

            if (field.type === "simplestring")
                filtersContent.set(name,
                    buildStringInputFilters(name, field, fieldDataSource, this.setStringInputFilter)
                );

            if (field.type === "multiselect") {
                filtersContent.set(name,
                    buildMultiSelectFilters(name, field, fieldDataSource, this.setMultiSelectFilter)
                );
            }

            if (field.type === "number")
                filtersContent.set(name,
                    buildNumberFilters(name, field, fieldDataSource, this.setNumberFilter)
                );

            if (field.type === "bool")
                filtersContent.set(name,
                    buildBooleanFilters(name, field, fieldDataSource, this.setBooleanFilter)
                );

            if (field.type === "date")
                filtersContent.set(name,
                    buildDateFilters(name, field, fieldDataSource, this.setDateFilter)
                );
        });

        this.setState((state, props) => {
            return { filtersContent };
        });
    };

    manualBuildFilterContent(fieldName){
        const { dataFields } = this.props;
        const field = dataFields[fieldName];
        let filterElement;

        if (field.type === "autocomplete") {
            const fieldDataSource = getFieldDataSource(field, true);

            filterElement = buildAutocompleteFilters(
                fieldName, field, fieldDataSource, this.setStringInputFilter
            );
        }

        if (field.type === "simplestring") {
            const fieldDataSource = getFieldDataSource(field, false);

            filterElement = buildStringInputFilters(
                fieldName, field, fieldDataSource, this.setStringInputFilter
            );
        }

        if (field.type === "multiselect") {
            const fieldDataSource = getFieldDataSource(field, true);

            filterElement = buildMultiSelectFilters(fieldName, field, fieldDataSource, this.setMultiSelectFilter);
        }

        if (field.type === "number") {
            const fieldDataSource = getFieldDataSource(field, false);

            filterElement = buildNumberFilters(fieldName, field, fieldDataSource, this.setNumberFilter);
        }

        if (field.type === "bool") {
            const fieldDataSource = getFieldDataSource(field, false);

            filterElement = buildBooleanFilters(fieldName, field, fieldDataSource, this.setBooleanFilter);
        }

        if (field.type === "date") {
            const fieldDataSource = getFieldDataSource(field, false);

            filterElement = buildDateFilters(fieldName, field, fieldDataSource, this.setDateFilter);
        }

        let { filtersContent } = this.state;

        if (filtersContent.has(fieldName))
            filtersContent.delete(fieldName);
        else 
            filtersContent.set(fieldName, filterElement);

        this.setState((state, props) => {
            return { filtersContent };
        });
    };

    setDateFilter({ operator, date }, name){
        const { clientFilterBy } = this.state;
        const key = getFieldKey(this.props.dataFields, name);
        const value = `${operator} ${date}`;

        if (!date) 
            clientFilterBy.delete(key);
        else 
            clientFilterBy.set(key, value);

        this.setState({
            clientFilterBy
        });
    };

    setNumberFilter({ operator, number }, name){
        const { clientFilterBy } = this.state;
        const key = getFieldKey(this.props.dataFields, name);
        const value = `${operator} ${number}`;

        if (!number) 
            clientFilterBy.delete(key);
        else 
            clientFilterBy.set(key, value);

        this.setState({
            clientFilterBy
        });
    };

    setStringInputFilter({ value }, name){
        const { clientFilterBy } = this.state;
        const key = getFieldKey(this.props.dataFields, name);

        if (!value) 
            clientFilterBy.delete(key);
        else 
            clientFilterBy.set(key, value);

        this.setState({
            clientFilterBy
        });
    };

    setMultiSelectFilter({ values }, name, stringValues){
        const { clientFilterBy } = this.state;
        const key = getFieldKey(this.props.dataFields, name);
        const actualValues = values.map(val => stringValues[val]);

        if (!actualValues || actualValues.length === 0)
            clientFilterBy.delete(key);
        else
            clientFilterBy.set(key, actualValues);

        this.setState({
            clientFilterBy
        });
    };

    setBooleanFilter({ value }, name){
        const { clientFilterBy } = this.state;
        const key = getFieldKey(this.props.dataFields, name);

        if (!value || value === " - ") 
            clientFilterBy.delete(key);
        else 
            clientFilterBy.set(key, value);

        this.setState({
            clientFilterBy
        });
    };


    closeFiltersDrawer(){
        this.setState((state, props) => {
            return {
                filtersDrawerVisible: false
            };
        });
    };

    toggleFilterSelection(e){
        const { name, checked } = e.target;
        let { visibleFilters, clientFilterBy } = this.state;

        visibleFilters.set(name, checked);

        const filterByClone = clientFilterBy;

        if (filterByClone.has(name))
            filterByClone.delete(name);

        this.setState((state, props) => {
            return {
                visibleFilters,
                clientFilterBy: filterByClone
            };
        });

        this.manualBuildFilterContent(name);
    };

    filterSelectionContent(){
        const allfields = Object.keys(this.props.dataSource[0]);
        const filteredFields = this.discardExcludedFields(allfields);

        const fieldCheckBoxes = filteredFields.map(key => {

            return (
                <Checkbox
                    name={key}
                    key={`${key}-filter-selection`}
                    checked={this.state.visibleFilters.get(key)}
                    onChange={this.toggleFilterSelection}>
                    {getFieldUIName(this.props.dataFields[key])}
                </Checkbox>
            );
        });

        return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {fieldCheckBoxes}
        </div>;
    }

    clearFilters(event){

        this.setState((state, props) => {
            return {
                isFilterEnabled: false,
                dataSource: props.dataSource,
                ServerFilterBy: [],
                FilteredData: [],
                clientFilterBy: new Map(),
                filtersContent: new Map()
            };
        }, this.autoBuildFilterContent);
    };

    showFiltersInDrawer(){
        let filterElements = [];

        for (const value of this.state.filtersContent.values()) {
            filterElements.push(value);
        }

        if (filterElements.length > 0)
            filterElements.push(this.buildSenderButton());

        if (filterElements.length === 0)
            filterElements.push(<p key="no-items"> No Items </p>);

        return filterElements;
    };

    toggleDrawerVisibility(event){
        this.setState((state, props) => {
            return { filtersDrawerVisible: !state.filtersDrawerVisible }
        });
    };

    async onSearchAllServer(e){
        const ServerFilterBy = [
            {
                Name: "ALL",
                Type: null,
                Values: [e.toLowerCase()]
            }
        ];

        this.setState((state, props) => {
            return {
                ServerFilterBy,
                visibleFilters: props.savedVisibleFilters || new Map(),
                filtersContent: new Map(),
                filtersDrawerVisible: false,
                isFilterEnabled: true,
                isSearching: true
            };
        });

        const result = await this.props.onPostFilters(ServerFilterBy);

        this.setState((state, props) => {
            return {
                FilteredData: result,
                isSearching: false
            };
        });
    };

    buildSenderButton(){
        return (<Button
            tabIndex="1"
            key="query-sender-button"
            loading={this.state.isSearching}
            type="primary"
            style={{ marginTop: "1em" }}
            onClick={this.handleServerFiltering}>
            Search
        </Button>);
    }

    async handleServerFiltering(event){

        const ServerFilterBy = this.mapFiltersToServer();

        this.setState((state, props) => {
            return {
                ServerFilterBy,
                isFilterEnabled: true,
                isSearching: true
            }
        });

        const result = await this.props.onPostFilters(ServerFilterBy);

        this.setState({
            FilteredData: result,
            isSearching: false
        });
    };

    renderListComponent(renderList){

        const { ServerFilterBy, isSearching, dataSource, FilteredData } = this.state;

        return ServerFilterBy.length > 0
            ? isSearching
                ? renderList(dataSource, true)
                : renderList(FilteredData, false)
            : renderList(dataSource, false);
    }

    render() {
        const { autoBuildFilters, renderList, withFilterPicker } = this.props;

        return (
            <div className="list-filter-container">
                <Card className="list-filters">
                    <Drawer
                        closable={true}
                        mask={false}
                        onClose={this.closeFiltersDrawer}
                        visible={this.state.filtersDrawerVisible}>
                        <div className="filters-content">
                            {this.showFiltersInDrawer()}
                        </div>
                    </Drawer>

                    <div className="filter-controls">
                        <div className="filter-controls-left">
                            {withFilterPicker &&
                                <div className="filter-picker">
                                    <Tooltip placement="left" title={`${this.state.filtersDrawerVisible ? 'Hide' : 'Show'} Filters`}>
                                        <Button
                                            style={{ margin: "0.3em" }}
                                            type={"primary"}
                                            shape="circle"
                                            onClick={this.toggleDrawerVisibility}>
                                            <Icon type="filter" />
                                        </Button>
                                    </Tooltip>
                                    {!autoBuildFilters && (
                                        <Popover
                                            placement={'bottom'}
                                            trigger='hover'
                                            content={this.filterSelectionContent()}>
                                            <Tooltip placement="right" title="Available Filters">
                                                <Button type="circle">
                                                    <Icon type="bars" />
                                                </Button>
                                            </Tooltip>
                                        </Popover>
                                    )}
                                </div>}
                            {this.state.isFilterEnabled && (
                                <Button
                                    onClick={this.clearFilters}
                                    style={{ margin: "0.3em" }}
                                    type="danger"
                                    icon="close">
                                    Clear
                                </Button>
                            )}
                        </div>
                        <div className="filter-controls-right">
                            <SearchAllBar
                                clearText={this.state.isFilterEnabled &&
                                    this.state.ServerFilterBy[0] &&
                                    this.state.ServerFilterBy[0].Name !== "ALL"}
                                onSearch={this.onSearchAllServer}
                            />
                        </div>
                    </div>
                </Card>
                {this.renderListComponent(renderList)}
            </div>
        );
    }
}

ServerFilter.propTypes = {
    dataFields: PropTypes.objectOf(
        PropTypes.shape({
            type: PropTypes.oneOf([
                "simplestring",
                "autocomplete",
                "multiselect",
                "number",
                "date",
                "bool"
            ]).isRequired,
            uiName: PropTypes.string.isRequired,
            format: PropTypes.string,
            dataSource: PropTypes.array.isRequired,
            nullValue: PropTypes.any
        }).isRequired
    ).isRequired,
    savedVisibleFilters: PropTypes.array,
    dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
    autoBuildFilters: PropTypes.bool,
    onPostFilters: PropTypes.func.isRequired,
    renderList: PropTypes.func.isRequired,
    customStyles: PropTypes.objectOf(PropTypes.object),
    excludeFields: PropTypes.arrayOf(PropTypes.string),
    withFilterPicker: PropTypes.bool
};

ServerFilter.defaultProps = {
    withFilterPicker: true,
    autoBuildFilters: false,
};

export default ServerFilter;
