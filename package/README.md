# Description

This is a component that creates and adds filtering functionality on your data.

It works only with the [antd](https://github.com/ant-design/ant-design) UI Library and accepts an antd [List](https://ant.design/components/list/) or [Table](https://ant.design/components/table/) Component 
as a render prop, on which it actually applies the filtering rules.

It then builds the filtering UI based on the [props](#common-props) and [fields](#fields-configuration) that you have specified. 

## Manual

1. [How to configure the fields of your data.](#fields-configuration)
2. [Client & Server filter components differences.](#client--server-filter-components)
3. [Common props.](#common-props)
4. [ClientFilter usage and component-specific props.](#clientfilter-props)
5. [ServerFilter usage and component-specific props.](#serverfilter-props)
6. [Example.](#example)


### Fields Configuration ###

In order to apply the filtering functionality you have to specify some information on each field of your data. 
The configuration options are decribed below: 

Fields    | Accepted Values  | Notes  
----------|------------------|-------
type      |'simplestring', 'multiselect', 'autocomplete', 'number', 'date', bool' | Required
uiName    | *The Name to display* | Required
dataSource| *An array of values. If this is ommited, then the distinct values to choose from will be extracted from the actual data* | Required Field For Server Filtering.
format    | *The date format of your dates* | Required for date fields only -has no use on other types. 

*The library will build a corresponding antd component based on the **type** that you have specified for each field*

### Client & Server Filter Components ###

1. ClientFilter 

As its name implies, this component assumes that you have already got all of your data from the server and the filtering is applied client-side on that data.

2. ServerFilter

This component accepts an extra prop called *onPostFilters* that has to return a Promise. That would usually be a *fetch* POST request that sends the contents of the applied filters on the specified endpoint and gets the response with the filtered data. More on this in [ServerFilter usage and component-specific props](#serverfilter-props#). section. 

### Common Props ###

ClientFilter and ServerFilter Components share the majority of their props, which are basically adding filtering functionality or setting rules on the to-be filtered fields. 

Prop            |                              Description                          |      Type     |      Default     |
----------------|-------------------------------------------------------------------|---------------|------------------|
dataFields      | As described [above](#fields-configuration#)                      |object         |         -        |
dataSource      | The data that will be rendered and filtered                       |array          |         -        |
savedVisibleFilters| Filters that were applied and saved for user last time(optional)|array         |         -        |
autoBuildFilters| Enable user to pick filters manually or build them automatically for all fields that are on the dataSource | bool | false
withFilterPicker| Show filter picker or just use the search all bar at the top-right| bool          | true             |
excludeFields   | Exclude fields that we do not want filtering on, or can't filter  | array         | -                |
renderList      | Function with two parameters (dataSource, loading indicator) that renders a List or Table antd component. See [example](#example#) | func | -  

