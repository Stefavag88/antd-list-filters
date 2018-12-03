import React from "react";
import PropTypes from "prop-types";
import { Drawer, Popover, Card, Button, Select, Checkbox, Tooltip } from "antd";
import { prepareFilterQuery, applyFilters } from "./QueryBuilder";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchAllBar from "./Components/SearchAllBar";
//import Dotnetify from "dotnetify";
import {getFieldKey, getFieldType, getFieldUIName} from "./FieldHelper";
import { buildBooleanFilters, buildAutocompleteFilters, buildDateFilters, buildMultiSelectFilters, buildNumberFilters, buildStringInputFilters } from './FilterBuilder/';
import "./index.css";

const Option = Select.Option;

// Dotnetify.hubServerUrl = AppConfiguration.DotnetifyHubUrl;
// Dotnetify.debug = true;

class ListFilter extends React.Component {
    constructor(props) {
        super(props);

        // let access_token = window.sessionStorage.getItem("access_token");

        // if (access_token) {
        //   let initialState = { CustomerId: this.props.customerId };

        //   this.vm = Dotnetify.react.connect(
        //     "QueryAnalyzerViewModel",
        //     this,
        //     {
        //       vmArg: initialState,
        //       headers: { Authorization: "Bearer " + access_token },
        //       exceptionHandler: ex => this.onException(ex)
        //     }
        //   );
        // } else {
        //   // throw exception
        // }

        this.state = {
            IsBusy: true,
            isFilterEnabled: false,
            dataSource: this.props.dataSource,
            clientFilterBy: new Map(),
            ServerFilterBy: null,
            FilteredData: null,
            visibleFilters: new Map(),
            filtersContent: new Map(),
            filtersDrawerVisible: false
        };
    }

    //   onException = exception => {
    //     if (exception.name === "UnauthorizedAccessException")
    //       this.props.onExpiredAccess && this.props.onExpiredAccess();
    //   };

    //   dispatchState = state => this.vm.$dispatch(state);

    componentDidMount = () => {
        const { autoBuildFilters } = this.props;

        if (autoBuildFilters) this.autoBuildFilterContent();
    };

    mapFiltersToServer = () => {
        let serverFilters = [];

        for (let entry of this.state.clientFilterBy) {
            const [key, value] = entry;

            let serverFilter = {
                Name: key,
                Type: getFieldType(this.props.dataFields, key),
                Values: Array.isArray(value) ? value : [value]
            };

            serverFilters.push(serverFilter);
        }

        return serverFilters;
    };

    resetDataSource = () => {
        this.setState((state, props) => {
            return { dataSource: props.dataSource };
        });
    };

    sendFilterQuery = e => {
        let { clientFilterBy } = this.state;

        if (!clientFilterBy) return;

        if (clientFilterBy.size === 0) {
            this.resetDataSource();

            return;
        }

        if (this.props.mode === "client") {
            const filterQuery = prepareFilterQuery(this.props, this.state);

            const newDataSource = applyFilters(this.props.dataSource, filterQuery);

            this.setState((state, props) => {
                return {
                    dataSource: newDataSource,
                    isFilterEnabled: true
                };
            });
        }
    };

    discardExcludedFields = fieldNames => {
        let fieldNamesExcluded = [...fieldNames];

        const { excludeFields } = this.props;

        if (excludeFields && excludeFields.length > 0) {
            fieldNamesExcluded = fieldNamesExcluded.filter(
                fieldName => !excludeFields.includes(fieldName)
            );
        }

        return fieldNamesExcluded;
    };

    autoBuildFilterContent = () => {
        const { dataSource, dataFields } = this.props;
        const allfieldNames = Object.keys(dataSource[0]);
        const desiredFieldNames = this.discardExcludedFields(allfieldNames);

        let filtersContent = [];

        desiredFieldNames.forEach(name => {
            let distinctValues;

            const field = dataFields[name];

            if (field.type === "autocomplete") {
                distinctValues = new Set([...dataSource.map(record => record[name])]);

                filtersContent.push(
                    buildAutocompleteFilters(name, dataFields, distinctValues, this.setStringInputFilter)
                );
            }

            if (field.type === "simplestring") 
                filtersContent.push(
                    buildStringInputFilters(name, dataFields, this.setStringInputFilter)
                );

            if (field.type === "multiselect") {
                distinctValues = new Set([...dataSource.map(record => record[name])]);

                filtersContent.push(
                    buildMultiSelectFilters(name, dataFields, distinctValues, this.setMultiSelectFilter)
                );
            }

            if (field.type === "number") 
                filtersContent.push(
                    buildNumberFilters(name, dataFields, null, this.setNumberFilter)
                );

            if (field.type === "bool")
                filtersContent.push(
                    buildBooleanFilters(name, dataFields, this.setBooleanFilter)
                );

            if (field.type === "date")
                filtersContent.push(
                    buildDateFilters(name, dataFields, this.setDateFilter)
                );
        });

        filtersContent.push(this.buildSenderButton());

        this.setState((state, props) => {
            return { filtersContent };
        });
    };

    manualBuildFilterContent = fieldName => {
        const { dataFields, dataSource } = this.props;

        const field = dataFields[fieldName];

        let filterElement, distinctValues;

        if (field.type === "autocomplete") {
            distinctValues = new Set([
                ...dataSource.map(record => record[fieldName])
            ]);

            filterElement = buildAutocompleteFilters(
                name, dataFields, distinctValues, this.setStringInputFilter
            );
        }

        if (field.type === "simplestring") 
            filterElement = buildStringInputFilters(
                name, dataFields, this.setStringInputFilter
            );

        if (field.type === "multiselect") {
            distinctValues = new Set([
                ...dataSource.map(record => record[fieldName])
            ]);

            filterElement = buildMultiSelectFilters(
                name, dataFields, distinctValues, this.setMultiSelectFilter
            );
        }

        if (field.type === "number") 
            filterElement = buildNumberFilters(name, dataFields, null, this.setNumberFilter);

        if (field.type === "bool")
            filterElement = buildBooleanFilters(name, dataFields, this.setBooleanFilter);

        if (field.type === "date")
            filterElement = buildDateFilters(name, dataFields, this.setDateFilter);

        let { filtersContent } = this.state;

        if (filtersContent.has(fieldName)) 
            filtersContent.delete(fieldName);
        else 
            filtersContent.set(fieldName, filterElement);

        this.setState((state, props) => {
            return { filtersContent };
        });
    };

    setDateFilter = ({ operator, date }, name) => {
        const { clientFilterBy } = this.state;

        const key = getFieldKey(this.props.dataFields, name);

        const value = `${operator} ${date}`;

        if (!date) clientFilterBy.delete(key);
        else clientFilterBy.set(key, value);

        this.setState({
            clientFilterBy
        });
    };

    setNumberFilter = ({ operator, number }, name) => {
        const { clientFilterBy } = this.state;

        const key = getFieldKey(this.props.dataFields, name);

        const value = `${operator} ${number}`;

        if (!number) clientFilterBy.delete(key);
        else clientFilterBy.set(key, value);

        this.setState({
            clientFilterBy
        });
    };

    setStringInputFilter = ({ value }, name) => {
        const { clientFilterBy } = this.state;

        const key = getFieldKey(this.props.dataFields, name);

        if (!value) clientFilterBy.delete(key);
        else clientFilterBy.set(key, value);

        this.setState({
            clientFilterBy
        });
    };

    setMultiSelectFilter = ({ values }, name, stringValues) => {
        const { clientFilterBy } = this.state;

        const key = getFieldKey(this.props.dataFields, name);

        const actualValues = values.map(val => stringValues[val]);

        if (!actualValues || actualValues.length === 0) clientFilterBy.delete(key);
        else clientFilterBy.set(key, actualValues);

        this.setState({
            clientFilterBy
        });
    };

    setBooleanFilter = ({ value }, name) => {
        const { clientFilterBy } = this.state;

        const key = getFieldKey(this.props.dataFields, name);

        if (!value || value === " - ") clientFilterBy.delete(key);
        else clientFilterBy.set(key, value);

        this.setState({
            clientFilterBy
        });
    };

    
    closeFiltersDrawer = () => {
        this.setState((state, props) => {
            return {
                filtersDrawerVisible: false
            };
        });
    };

    toggleFilterSelection = e => {
        const { name, checked } = e.target;

        let { visibleFilters, clientFilterBy } = this.state;

        visibleFilters.set(name, checked);

        const filterByClone = clientFilterBy;

        if (filterByClone.has(name)) filterByClone.delete(name);

        this.setState((state, props) => {
            return { visibleFilters, clientFilterBy: filterByClone };
        });

        this.manualBuildFilterContent(name);
    };

    filterSelectionContent = () => {
        const allfields = Object.keys(this.props.dataSource[0]);

        const filteredFields = this.discardExcludedFields(allfields);

        console.log("FilteredKeys..", filteredFields);

        const fieldCheckBoxes = filteredFields.map(field => (
            <Checkbox
                name={field}
                key={`${field}-filter-selection`}
                checked={this.state.visibleFilters.get(field)}
                onChange={this.toggleFilterSelection}
            >
                {getFieldUIName(this.props.dataFields, field)}
            </Checkbox>
        ));

        return fieldCheckBoxes;
    };

    clearFilters = event => {
        this.setState((state, props) => {
            return {
                isFilterEnabled: false,
                dataSource: props.dataSource,
                ServerFilterBy: null,
                FilteredData: null,
                clientFilterBy: new Map(),
                visibleFilters: props.savedVisibleFilters || new Map(),
                filtersContent: new Map()
            };
        });
    };

    showFiltersInDrawer = () => {
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

    onPopoverVisibilityChange = visible => {
        if (this.state.filtersDrawerVisible && !visible) return;

        this.setState({
            filtersDrawerVisible: visible
        });
    };

    onSearchAllClient = e => {
        let matched = [];

        if (e.length === 0) {
            matched = this.props.dataSource;
        } else {
            matched = this.props.dataSource.filter(record => {
                const stringValues = Object.values(record).map(v => "" + v);

                const found = stringValues.some(val =>
                    val.toLowerCase().includes(e.toLowerCase())
                );

                return found;
            });
        }

        this.setState((state, props) => {
            return {
                dataSource: matched,
                clientFilterBy: new Map(),
                visibleFilters: props.savedVisibleFilters || new Map(),
                filtersContent: new Map(),
                filtersDrawerVisible: false,
                isFilterEnabled: true
            };
        });
    };

    onSearchAllServer = e => {
        const ServerFilterBy = [
            {
                Name: "ALL",
                Type: null,
                Values: [e.toLowerCase()]
            }
        ];

        this.setState((state, props) => {
            return {
                dataSource: null,
                ServerFilterBy,
                visibleFilters: props.savedVisibleFilters || new Map(),
                filtersContent: new Map(),
                filtersDrawerVisible: false,
                isFilterEnabled: true
            };
        });

        this.dispatchState({ ServerFilterBy });
    };

    buildSenderButton = () => {
        const { mode } = this.props;

        if (mode === "client") {
            return (
                <Button
                    type="primary"
                    style={{ marginTop: "1em" }}
                    onClick={this.sendFilterQuery}
                >Search</Button>
            );
        } else {
            return (
                <Button
                    loading={!this.state.FilteredData && this.state.ServerFilterBy}
                    type="primary"
                    style={{ marginTop: "1em" }}
                    onClick={this.handleServerFiltering}
                >Search</Button>
            );
        }
    };

    handleServerFiltering = event => {
        const ServerFilterBy = this.mapFiltersToServer();

        this.setState({ ServerFilterBy, isFilterEnabled: true });
        this.dispatchState({ ServerFilterBy });
    };

    render() {
        const { autoBuildFilters, renderList, drawerProps } = this.props;

        return (
            <div className="list-filter-container">
                <Card className="list-filters">
                    <Drawer
                        style={(drawerProps && drawerProps.style) || { width: 250 }}
                        placement={(drawerProps && drawerProps.placement) || "right"}
                        closable={true}
                        mask={false}
                        onClose={this.closeFiltersDrawer}
                        visible={this.state.filtersDrawerVisible}>
                        <div className="filters-content">{this.showFiltersInDrawer()}</div>
                    </Drawer>

                    <div className="filter-controls">
                        <div className="filter-controls-left">
                            {(this.props.withFilterPicker && !autoBuildFilters) && (
                                <Popover
                                    style={{ display: "flex", flexDirection: "column" }}
                                    placement="bottomLeft"
                                    onVisibleChange={this.onPopoverVisibilityChange}
                                    content={this.filterSelectionContent()}
                                    trigger="click"
                                >
                                    <Tooltip placement="topRight" title="Filters">
                                        <Button
                                            style={{ margin: "0.3em" }}
                                            type={"primary"}
                                            shape="circle"
                                        >
                                            <FontAwesomeIcon icon={faSlidersH} />
                                        </Button>
                                    </Tooltip>
                                </Popover>
                            )}
                            {this.state.isFilterEnabled && (
                                <Button
                                    onClick={this.clearFilters}
                                    style={{ margin: "0.3em" }}
                                    type="danger"
                                    icon="close"
                                >
                                    Clear Filters
                </Button>
                            )}
                        </div>

                        <div className="filter-controls-right">
                            {this.props.mode === "client" && (
                                <SearchAllBar
                                    shouldClear={this.state.isFilterEnabled}
                                    onSearch={this.onSearchAllClient}
                                />
                            )}
                            {this.props.mode === "server" && (
                                <SearchAllBar
                                    shouldClear={this.state.isFilterEnabled}
                                    onSearch={this.onSearchAllServer}
                                />
                            )}
                        </div>
                    </div>
                </Card>
                {this.state.ServerFilterBy && renderList(this.state.FilteredData)}
                {!this.state.ServerFilterBy && renderList(this.state.dataSource)}
            </div>
        );
    }
}

ListFilter.propTypes = {
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
            dataSource: PropTypes.array,
            nullValue: PropTypes.any
        })
    ).isRequired,
    savedVisibleFilters: PropTypes.array,
    dataSource: PropTypes.arrayOf(Object).isRequired,
    autoBuildFilters: PropTypes.bool,
    mode: PropTypes.oneOf(["client", "server"]),
    renderList: PropTypes.func.isRequired,
    drawerProps: PropTypes.shape({
        placement: PropTypes.oneOf(["left", "top", "right", "bottom"]),

        style: PropTypes.object
    }),
    filterBtnStyle: PropTypes.oneOf([React.Component, "string"]),
    excludeFields: PropTypes.arrayOf(PropTypes.string),
    onSendFiltersToServer: PropTypes.func,
    withFilterPicker: PropTypes.bool
};

ListFilter.defaultProps = {
    withFilterPicker: true,
    autoBuildFilters: false,
    mode: "client"
};

export default ListFilter;
