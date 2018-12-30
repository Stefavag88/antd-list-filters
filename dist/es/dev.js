import 'antd/lib/card/style';
import _Card from 'antd/lib/card';
import 'antd/lib/popover/style';
import _Popover from 'antd/lib/popover';
import 'antd/lib/tooltip/style';
import _Tooltip from 'antd/lib/tooltip';
import 'antd/lib/icon/style';
import _Icon from 'antd/lib/icon';
import 'antd/lib/drawer/style';
import _Drawer from 'antd/lib/drawer';
import 'antd/lib/button/style';
import _Button from 'antd/lib/button';
import 'antd/lib/checkbox/style';
import _Checkbox from 'antd/lib/checkbox';
import React from 'react';
import PropTypes from 'prop-types';
import fnsFormatDate from 'date-fns/format';
import fnsParseDate from 'date-fns/parse';
import fnsIsAfter from 'date-fns/is_after';
import fnsIsEqual from 'date-fns/is_equal';
import fnsIsWithinRange from 'date-fns/is_within_range';
import fnsIsBefore from 'date-fns/is_before';
import { Parser } from 'expr-eval';
import 'antd/lib/input/style';
import _Input from 'antd/lib/input';
import 'antd/lib/select/style';
import _Select from 'antd/lib/select';
import 'antd/lib/input-number/style';
import _InputNumber from 'antd/lib/input-number';
import 'antd/lib/date-picker/style';
import _DatePicker from 'antd/lib/date-picker';
import fnsIsValid from 'date-fns/is_valid';
import 'antd/lib/auto-complete/style';
import _AutoComplete from 'antd/lib/auto-complete';
import 'antd/dist/antd.css';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var getFieldUIName = function getFieldUIName(fieldName) {
  var uiName = fieldName.uiName;
  if (!uiName) throw new Error("ERROR: No uiName defined for field " + fieldName);
  return uiName;
};
var getDateFieldFormat = function getDateFieldFormat(fieldName) {
  var fieldType = getFieldType(fieldName);
  if (fieldType !== 'date') throw new Error("ERROR: Trying to get date format for non-date field, " + fieldName);
  var dateFormat = fieldName.format;
  if (fieldType === 'date' && !dateFormat) throw new Error("ERROR: No dateformat defined for field " + fieldName);
  return dateFormat;
};
var getFieldType = function getFieldType(fieldName) {
  return fieldName.type;
};
var getFieldDataSource = function getFieldDataSource(fieldName, mandatory) {
  var dataSource = fieldName.dataSource;
  if (!dataSource) console.warn("WARNING: No dataSource property given to the field the field " + fieldName.uiName + ".");
  if (!dataSource && mandatory) throw new Error("ERROR: property dataSource is required for field " + fieldName.uiName);
  if (dataSource && dataSource.length === 0 && mandatory) throw new Error("WARNING: property dataSource for field " + fieldName.uiName + " is passed but is an empty array. ");
  return dataSource;
};
var getFieldKey = function getFieldKey(dataFields, fieldName) {
  var fieldKey = Object.keys(dataFields).find(function (key) {
    return key === fieldName;
  });
  if (!fieldKey) throw new Error("ERROR: No field defined with the name " + fieldName + ".");
  return fieldKey;
};

var discardNullUndefined = function discardNullUndefined(setOfValues) {
  if (setOfValues.has(null)) setOfValues.delete(null);
  if (setOfValues.has(undefined)) setOfValues.delete(undefined);
  if (setOfValues.has("")) setOfValues.delete("");
  return setOfValues;
};

var generateFieldDataSourceValues = function generateFieldDataSourceValues(listDataSource, fieldName) {
  //TODO: CHECK THE PERFORMANCE OF THIS FUNCTION FOR LARGE INPUTS.(20-100)
  var retrievedValues = [].concat(listDataSource.map(function (record) {
    return record[fieldName];
  }));
  var distinctValues = new Set(retrievedValues); //KEEP UNIQUE VALUES

  distinctValues = discardNullUndefined(distinctValues);
  return distinctValues.size > 0 ? Array.from(distinctValues) : [];
};

var operationsMap = {
  "<": "checkIsBefore",
  ">": "checkIsAfter",
  "in": "checkIsBetween",
  "==": "checkIsSame"
};
var parser = new Parser();

var prepareDate = function prepareDate(date, format) {
  return fnsFormatDate(fnsParseDate(date), format);
};

parser.functions.checkIsBefore = function (checkedDate, date, format) {
  return fnsIsBefore(prepareDate(checkedDate, format), prepareDate(date, format));
};

parser.functions.checkIsAfter = function (checkedDate, date, format) {
  return fnsIsAfter(prepareDate(checkedDate, format), prepareDate(date, format));
};

parser.functions.checkIsBetween = function (checkedDate, dateFrom, dateTo, format) {
  return fnsIsWithinRange(prepareDate(checkedDate, format), prepareDate(dateFrom, format), prepareDate(dateTo, format));
};

parser.functions.checkIsSame = function (checkedDate, date, format) {
  return fnsIsEqual(prepareDate(checkedDate, format), prepareDate(date, format));
};

parser.functions.isLike = function (whole, part) {
  return whole.includes(part);
};

var prepareFilterQuery = function prepareFilterQuery(props, state) {
  var clientFilterBy = state.clientFilterBy;
  var queryString = "( ";

  var _loop = function _loop() {
    if (_isArray) {
      if (_i >= _iterator.length) return "break";
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) return "break";
      _ref = _i.value;
    }

    var _ref2 = _ref,
        key = _ref2[0],
        val = _ref2[1];
    if (queryString.length > 2) queryString += " and (";
    var field = props.dataFields[key];

    if (getFieldType(field) === 'multiselect') {
      //For multi-select
      var innerQueryString = "";
      val.forEach(function (v) {
        if (innerQueryString.length > 0) innerQueryString += " or ";
        innerQueryString += "d." + key + " == \"" + v + "\"";
      });
      innerQueryString += " )";
      queryString += innerQueryString;
    } else {
      if (getFieldType(field) === 'autocomplete') queryString += "d." + key + " == \"" + val + "\"";else if (getFieldType(field) === 'simplestring') queryString += "isLike(d." + key + ", " + val + ")";else if (getFieldType(field) === 'number') queryString += "d." + key + " " + val;else if (getFieldType(field) === 'bool') queryString += "d." + key + " == " + val;else if (getFieldType(field) === 'date') {
        var _fnsFormatDate = getDateFieldFormat(field);

        queryString += val.includes(',') ? parseDatesArray(key, val, _fnsFormatDate) : parseSingleDate(key, val, _fnsFormatDate);
      }
      queryString += " )";
    }
  };

  for (var _iterator = clientFilterBy.entries(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    var _ret = _loop();

    if (_ret === "break") break;
  }

  return queryString;
};

var parseDatesArray = function parseDatesArray(key, datesWithOperator, format) {
  var dates = datesWithOperator.split(',');
  var splitOperator = dates[0].split(" ");
  var operator = splitOperator[0];
  var startDate = splitOperator[1];
  var endDate = dates[1];
  return operationsMap[operator] + "(d." + key + ", '" + startDate + "', '" + endDate + "', '" + format + "')";
};

var parseSingleDate = function parseSingleDate(key, dateWithOperator, format) {
  var splitOperator = dateWithOperator.split(" ");
  var operator = splitOperator[0];
  var date = splitOperator[1];
  return operationsMap[operator] + "(d." + key + ", '" + date + "', '" + format + "')";
};

var applyFilters = function applyFilters(dataSource, filterQuery) {
  var queryFunction = parser.parse(filterQuery).toJSFunction('d');
  var filteredSource = dataSource.filter(function (d) {
    return queryFunction(d);
  });
  return filteredSource;
};

var Search = _Input.Search;

var SearchAllBar =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(SearchAllBar, _React$Component);

  function SearchAllBar(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.innerOnSearch = function (event) {
      _this.props.onSearch(event);
    };

    _this.componentDidUpdate = function (prevProps, prevState, snapshot) {
      if (_this.props.clearText && !prevProps.clearText) _this.inputRef.current.input.input.value = null;
    };

    _this.inputRef = React.createRef();
    return _this;
  }

  var _proto = SearchAllBar.prototype;

  _proto.render = function render() {
    return React.createElement(Search, {
      ref: this.inputRef,
      onSearch: this.innerOnSearch,
      placeholder: "Search..."
    });
  };

  return SearchAllBar;
}(React.Component);

var Option = _Select.Option;

var NumberFilter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(NumberFilter, _React$Component);

  function NumberFilter(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.componentDidUpdate = function (prevProps, prevState) {
      _this.props.onChange(_this.state);
    };

    _this.handleChange = function (value) {
      if (typeof value === 'string') {
        _this.setState(function (state, props) {
          return {
            operator: value
          };
        });
      } else {
        _this.setState(function (state, props) {
          return {
            number: value
          };
        });
      }
    };

    _this.state = {
      operator: "==",
      number: null
    };
    return _this;
  }

  var _proto = NumberFilter.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        name = _this$props.name,
        min = _this$props.min,
        max = _this$props.max;
    return React.createElement("div", {
      className: "ant-filter-container"
    }, React.createElement("span", null, name), React.createElement("div", {
      className: "filter-content"
    }, React.createElement(_Select, {
      className: "operator-value",
      defaultValue: "==",
      onChange: this.handleChange
    }, React.createElement(Option, {
      value: ">="
    }, ' >= '), React.createElement(Option, {
      value: "<="
    }, ' <= '), React.createElement(Option, {
      value: ">"
    }, ' > '), React.createElement(Option, {
      value: "<"
    }, ' < ', " "), React.createElement(Option, {
      value: "=="
    }, ' = '), React.createElement(Option, {
      value: "!="
    }, ' != ')), React.createElement(_InputNumber, {
      className: "filter-value",
      onChange: this.handleChange,
      key: name,
      placeholder: name,
      min: min,
      max: max
    })));
  };

  return NumberFilter;
}(React.Component);

NumberFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number
};

var BooleanFilter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(BooleanFilter, _React$Component);

  function BooleanFilter(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.componentDidUpdate = function (prevProps, prevState) {
      _this.props.onChange(_this.state);
    };

    _this.handleChange = function (value) {
      _this.setState(function (state, props) {
        return {
          value: value
        };
      });
    };

    _this.state = {
      value: null
    };
    return _this;
  }

  var _proto = BooleanFilter.prototype;

  _proto.render = function render() {
    var name = this.props.name;
    return React.createElement("div", {
      className: "ant-filter-container"
    }, React.createElement("span", null, name), React.createElement("div", {
      className: "filter-content"
    }, React.createElement(_Select, {
      style: {
        minWidth: 200,
        width: '100%'
      },
      allowClear: true,
      key: name,
      onChange: this.handleChange,
      placeholder: name
    }, React.createElement(_Select.Option, {
      key: true
    }, "YES"), React.createElement(_Select.Option, {
      key: false
    }, "NO"), React.createElement(_Select.Option, {
      key: ' - '
    }, " - "))));
  };

  return BooleanFilter;
}(React.Component);

BooleanFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

var Option$1 = _Select.Option;

var prepareDate$1 = function prepareDate(date, format) {
  return fnsFormatDate(fnsParseDate(date), format);
};

var isValidDate = function isValidDate(date) {
  return fnsIsValid(fnsParseDate(date));
};

var DateFilter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(DateFilter, _React$Component);

  function DateFilter(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.componentDidUpdate = function (prevProps, prevState) {
      _this.props.onChange(_this.state);
    };

    _this.handleChange = function (value) {
      if (typeof value === 'string') {
        _this.setState(function (state, props) {
          return {
            operator: value,
            date: null
          };
        }, function () {
          _this.dateRef.current.picker.clearSelection(new Event('clearEvent'));
        });
      } else {
        var dates = [];

        if (Array.isArray(value)) {
          value.forEach(function (val) {
            if (!isValidDate(val)) return;
            dates.push(prepareDate$1(val, _this.props.format));
          });
        } else {
          if (!isValidDate(value)) return;
          dates.push(prepareDate$1(value, _this.props.format));
        }

        _this.setState(function (state, props) {
          return {
            date: [].concat(dates)
          };
        });
      }
    };

    _this.renderDatePicker = function () {
      if (_this.state.operator === 'in') {
        return React.createElement(_DatePicker.RangePicker, {
          ref: _this.dateRef,
          format: _this.props.format,
          className: "filter-value",
          placeholder: ['From', 'To'],
          onChange: _this.handleChange
        });
      } else {
        return React.createElement(_DatePicker, {
          ref: _this.dateRef,
          format: _this.props.format,
          className: "filter-value",
          placeholder: _this.props.name,
          onChange: _this.handleChange
        });
      }
    };

    _this.state = {
      operator: '==',
      date: null
    };
    _this.dateRef = React.createRef();
    return _this;
  }

  var _proto = DateFilter.prototype;

  _proto.render = function render() {
    var name = this.props.name;
    return React.createElement("div", {
      className: "ant-filter-container"
    }, React.createElement("span", null, name), React.createElement("div", {
      className: "filter-content"
    }, React.createElement(_Select, {
      className: "operator-value",
      defaultValue: "==",
      onChange: this.handleChange
    }, React.createElement(Option$1, {
      value: ">"
    }, ' > '), React.createElement(Option$1, {
      value: "<"
    }, ' < '), React.createElement(Option$1, {
      value: "=="
    }, ' = '), React.createElement(Option$1, {
      value: "in"
    }, ' in ')), this.renderDatePicker()));
  };

  return DateFilter;
}(React.Component);

DateFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  format: PropTypes.string
};
DateFilter.defaultProps = {
  format: 'YYYY-MM-DD'
};

var StringInputFilter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(StringInputFilter, _React$Component);

  function StringInputFilter(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.componentDidUpdate = function (prevProps, prevState) {
      _this.props.onChange(_this.state);
    };

    _this.handleChange = function (event) {
      var value = event.target.value;

      _this.setState(function (state, props) {
        return {
          value: value
        };
      });
    };

    _this.state = {
      value: null
    };
    return _this;
  }

  var _proto = StringInputFilter.prototype;

  _proto.render = function render() {
    var name = this.props.name;
    return React.createElement("div", {
      className: "ant-filter-container"
    }, React.createElement("span", null, name), React.createElement("div", {
      className: "filter-content"
    }, React.createElement(_Input, {
      style: {
        width: '100%',
        minWidth: 200
      },
      key: name,
      onChange: this.handleChange,
      placeholder: name
    })));
  };

  return StringInputFilter;
}(React.Component);

StringInputFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

var AutoCompleteFilter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(AutoCompleteFilter, _React$Component);

  function AutoCompleteFilter(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.componentDidUpdate = function (prevProps, prevState) {
      _this.props.onChange(_this.state);
    };

    _this.handleChange = function (value) {
      _this.setState(function (state, props) {
        return {
          value: value
        };
      });
    };

    _this.state = {
      value: null
    };
    return _this;
  }

  var _proto = AutoCompleteFilter.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        name = _this$props.name,
        dataSource = _this$props.dataSource;
    return React.createElement("div", {
      className: "ant-filter-container"
    }, React.createElement("span", null, name), React.createElement("div", {
      className: "filter-content"
    }, React.createElement(_AutoComplete, {
      ref: this.inputRef,
      style: {
        width: '100%',
        minWidth: 200
      },
      allowClear: true,
      key: name,
      onChange: this.handleChange,
      dataSource: dataSource,
      placeholder: name
    })));
  };

  return AutoCompleteFilter;
}(React.Component);

AutoCompleteFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  dataSource: PropTypes.array
};

var MultiSelectFilter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(MultiSelectFilter, _React$Component);

  function MultiSelectFilter(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.componentDidUpdate = function (prevProps, prevState) {
      _this.props.onChange(_this.state);
    };

    _this.handleChange = function (values) {
      _this.setState(function (state, props) {
        return {
          values: values
        };
      });
    };

    _this.state = {
      values: []
    };
    return _this;
  }

  var _proto = MultiSelectFilter.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        name = _this$props.name,
        dataSource = _this$props.dataSource;
    return React.createElement("div", {
      className: "ant-filter-container"
    }, React.createElement("span", null, name), React.createElement("div", {
      className: "filter-content"
    }, React.createElement(_Select, {
      style: {
        minWidth: 200,
        width: '100%'
      },
      allowClear: true,
      onChange: this.handleChange,
      mode: "multiple",
      key: name,
      placeholder: name
    }, dataSource)));
  };

  return MultiSelectFilter;
}(React.Component);

MultiSelectFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  dataSource: PropTypes.array
};

var Option$2 = _Select.Option; //CONVENTION MADE: For ALL methods, if valuesSource is null 
//then we get the values automatically(distinct values)
//for controls that support it..

var buildNumberFilters = function buildNumberFilters(name, field, valuesSource, setFilterFunc) {
  var min, max;

  if (valuesSource && valuesSource.length > 1) {
    var _ref = [Math.min(valuesSource), Math.max(valuesSource)],
        checkMin = _ref[0],
        checkMax = _ref[1];
    min = isNaN(checkMin) ? -Infinity : checkMin;
    max = isNaN(checkMax) ? Infinity : checkMax;
  }

  return React.createElement(NumberFilter, {
    key: "number-filter-" + name,
    name: getFieldUIName(field),
    onChange: function onChange(state) {
      return setFilterFunc(state, name);
    },
    min: min,
    max: max
  });
};
var buildDateFilters = function buildDateFilters(name, field, valuesSource, setDateFilterFunc) {
  return React.createElement(DateFilter, {
    key: "date-filter-" + name,
    format: getDateFieldFormat(field),
    name: getFieldUIName(field),
    onChange: function onChange(state) {
      return setDateFilterFunc(state, name);
    }
  });
};
var buildBooleanFilters = function buildBooleanFilters(name, field, valuesSource, setBooleanFiltersFunc) {
  return React.createElement(BooleanFilter, {
    key: "boolean-filter-" + name,
    name: getFieldUIName(field),
    onChange: function onChange(state) {
      return setBooleanFiltersFunc(state, name);
    }
  });
};
var buildMultiSelectFilters = function buildMultiSelectFilters(name, field, valuesSource, setMultiSelectFiltersFunc) {
  var selectionValues = valuesSource.length > 0 ? valuesSource.map(function (val, index) {
    return React.createElement(Option$2, {
      key: index
    }, " ", val, " ");
  }) : React.createElement(Option$2, {
    key: name + "-empty"
  }, " - ");
  return React.createElement(MultiSelectFilter, {
    key: "multiselect-filter-" + name,
    name: getFieldUIName(field),
    dataSource: selectionValues,
    onChange: function onChange(state) {
      return setMultiSelectFiltersFunc(state, name, valuesSource);
    }
  });
};
var buildStringInputFilters = function buildStringInputFilters(name, field, valuesSource, setStringInputFilterFunc) {
  return React.createElement(StringInputFilter, {
    key: "stringInput-filter-" + name,
    name: getFieldUIName(field),
    onChange: function onChange(state) {
      return setStringInputFilterFunc(state, name);
    }
  });
};
var buildAutocompleteFilters = function buildAutocompleteFilters(name, field, valuesSource, setStringInputFiltersFunc) {
  return React.createElement(AutoCompleteFilter, {
    key: "autocomplete-filter-" + name,
    name: getFieldUIName(field),
    onChange: function onChange(state) {
      return setStringInputFiltersFunc(state, name);
    },
    dataSource: valuesSource
  });
};

var ListFilter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(ListFilter, _React$Component);

  function ListFilter(_props) {
    var _this;

    _this = _React$Component.call(this, _props) || this;

    _this.componentDidMount = function () {
      var autoBuildFilters = _this.props.autoBuildFilters;
      if (autoBuildFilters) _this.autoBuildFilterContent();
    };

    _this.resetDataSource = function () {
      _this.setState(function (state, props) {
        return {
          dataSource: props.dataSource
        };
      });
    };

    _this.sendFilterQuery = function (e) {
      var clientFilterBy = _this.state.clientFilterBy;
      if (!clientFilterBy) return;

      if (clientFilterBy.size === 0) {
        _this.resetDataSource();

        return;
      }

      var filterQuery = prepareFilterQuery(_this.props, _this.state);
      var newDataSource = applyFilters(_this.props.dataSource, filterQuery);

      _this.setState(function (state, props) {
        return {
          dataSource: newDataSource,
          isFilterEnabled: true
        };
      });
    };

    _this.discardExcludedFields = function (fieldNames) {
      var fieldNamesExcluded = [].concat(fieldNames);
      var excludeFields = _this.props.excludeFields;

      if (excludeFields && excludeFields.length > 0) {
        fieldNamesExcluded = fieldNamesExcluded.filter(function (fieldName) {
          return !excludeFields.includes(fieldName);
        });
      }

      return fieldNamesExcluded;
    };

    _this.decideFiltersToBuild = function () {
      var dataSource = _this.props.dataSource;
      var visibleFilters = _this.state.visibleFilters;

      if (visibleFilters.size > 0) {
        return Array.from(visibleFilters.keys());
      } else {
        var allfieldNames = Object.keys(dataSource[0]);
        return _this.discardExcludedFields(allfieldNames);
      }
    };

    _this.autoBuildFilterContent = function () {
      var _this$props = _this.props,
          dataFields = _this$props.dataFields,
          dataSource = _this$props.dataSource;

      var filtersToBuild = _this.decideFiltersToBuild();

      var filtersContent = new Map();
      filtersToBuild.forEach(function (name) {
        var field = dataFields[name];
        var fieldDataSource = getFieldDataSource(field) || generateFieldDataSourceValues(dataSource, name);

        if (field.type === "autocomplete") {
          filtersContent.set(name, buildAutocompleteFilters(name, field, fieldDataSource, _this.setStringInputFilter));
        }

        if (field.type === "simplestring") filtersContent.set(name, buildStringInputFilters(name, field, fieldDataSource, _this.setStringInputFilter));

        if (field.type === "multiselect") {
          filtersContent.set(name, buildMultiSelectFilters(name, field, fieldDataSource, _this.setMultiSelectFilter));
        }

        if (field.type === "number") filtersContent.set(name, buildNumberFilters(name, field, fieldDataSource, _this.setNumberFilter));
        if (field.type === "bool") filtersContent.set(name, buildBooleanFilters(name, field, fieldDataSource, _this.setBooleanFilter));
        if (field.type === "date") filtersContent.set(name, buildDateFilters(name, field, fieldDataSource, _this.setDateFilter));
      });

      _this.setState(function (state, props) {
        return {
          filtersContent: filtersContent
        };
      });
    };

    _this.manualBuildFilterContent = function (fieldName) {
      var _this$props2 = _this.props,
          dataFields = _this$props2.dataFields,
          dataSource = _this$props2.dataSource;
      var field = dataFields[fieldName];
      var filterElement;
      var fieldDataSource = getFieldDataSource(field) || generateFieldDataSourceValues(dataSource, fieldName);
      if (field.type === "autocomplete") filterElement = buildAutocompleteFilters(fieldName, field, fieldDataSource, _this.setStringInputFilter);
      if (field.type === "simplestring") filterElement = buildStringInputFilters(fieldName, field, fieldDataSource, _this.setStringInputFilter);
      if (field.type === "multiselect") filterElement = buildMultiSelectFilters(fieldName, field, fieldDataSource, _this.setMultiSelectFilter);
      if (field.type === "number") filterElement = buildNumberFilters(fieldName, field, fieldDataSource, _this.setNumberFilter);
      if (field.type === "bool") filterElement = buildBooleanFilters(fieldName, field, fieldDataSource, _this.setBooleanFilter);
      if (field.type === "date") filterElement = buildDateFilters(fieldName, field, fieldDataSource, _this.setDateFilter);
      var filtersContent = _this.state.filtersContent;
      if (filtersContent.has(fieldName)) filtersContent.delete(fieldName);else filtersContent.set(fieldName, filterElement);

      _this.setState(function (state, props) {
        return {
          filtersContent: filtersContent
        };
      });
    };

    _this.setDateFilter = function (_ref, name) {
      var operator = _ref.operator,
          date = _ref.date;
      var clientFilterBy = _this.state.clientFilterBy;
      var key = getFieldKey(_this.props.dataFields, name);
      var value = operator + " " + date;
      if (!date) clientFilterBy.delete(key);else clientFilterBy.set(key, value);

      _this.setState({
        clientFilterBy: clientFilterBy
      });
    };

    _this.setNumberFilter = function (_ref2, name) {
      var operator = _ref2.operator,
          number = _ref2.number;
      var clientFilterBy = _this.state.clientFilterBy;
      var key = getFieldKey(_this.props.dataFields, name);
      var value = operator + " " + number;
      if (!number) clientFilterBy.delete(key);else clientFilterBy.set(key, value);

      _this.setState({
        clientFilterBy: clientFilterBy
      });
    };

    _this.setStringInputFilter = function (_ref3, name) {
      var value = _ref3.value;
      var clientFilterBy = _this.state.clientFilterBy;
      var key = getFieldKey(_this.props.dataFields, name);
      if (!value) clientFilterBy.delete(key);else clientFilterBy.set(key, value);

      _this.setState({
        clientFilterBy: clientFilterBy
      });
    };

    _this.setMultiSelectFilter = function (_ref4, name, stringValues) {
      var values = _ref4.values;
      var clientFilterBy = _this.state.clientFilterBy;
      var key = getFieldKey(_this.props.dataFields, name);
      var actualValues = values.map(function (val) {
        return stringValues[val];
      });
      if (!actualValues || actualValues.length === 0) clientFilterBy.delete(key);else clientFilterBy.set(key, actualValues);

      _this.setState({
        clientFilterBy: clientFilterBy
      });
    };

    _this.setBooleanFilter = function (_ref5, name) {
      var value = _ref5.value;
      var clientFilterBy = _this.state.clientFilterBy;
      var key = getFieldKey(_this.props.dataFields, name);
      if (!value || value === " - ") clientFilterBy.delete(key);else clientFilterBy.set(key, value);

      _this.setState({
        clientFilterBy: clientFilterBy
      });
    };

    _this.closeFiltersDrawer = function () {
      _this.setState(function (state, props) {
        return {
          filtersDrawerVisible: false
        };
      });
    };

    _this.toggleFilterSelection = function (e) {
      var _e$target = e.target,
          name = _e$target.name,
          checked = _e$target.checked;
      var _this$state = _this.state,
          visibleFilters = _this$state.visibleFilters,
          clientFilterBy = _this$state.clientFilterBy;
      visibleFilters.set(name, checked);
      var filterByClone = clientFilterBy;
      if (filterByClone.has(name)) filterByClone.delete(name);

      _this.setState(function (state, props) {
        return {
          visibleFilters: visibleFilters,
          clientFilterBy: filterByClone
        };
      });

      _this.manualBuildFilterContent(name);
    };

    _this.filterSelectionContent = function () {
      var allfields = Object.keys(_this.props.dataSource[0]);

      var filteredFields = _this.discardExcludedFields(allfields);

      var fieldCheckBoxes = filteredFields.map(function (key) {
        return React.createElement(_Checkbox, {
          name: key,
          key: key + "-filter-selection",
          checked: _this.state.visibleFilters.get(key),
          onChange: _this.toggleFilterSelection
        }, getFieldUIName(_this.props.dataFields[key]));
      });
      return React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }
      }, fieldCheckBoxes);
    };

    _this.clearFilters = function (event) {
      _this.setState(function (state, props) {
        return {
          isFilterEnabled: false,
          dataSource: props.dataSource,
          clientFilterBy: new Map(),
          filtersContent: new Map()
        };
      }, _this.autoBuildFilterContent);
    };

    _this.showFiltersInDrawer = function () {
      var filterElements = [];

      for (var _iterator = _this.state.filtersContent.values(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref6;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref6 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref6 = _i.value;
        }

        var value = _ref6;
        filterElements.push(value);
      }

      if (filterElements.length > 0) filterElements.push(_this.buildSenderButton());
      if (filterElements.length === 0) filterElements.push(React.createElement("p", {
        key: "no-items"
      }, " No Items "));
      return filterElements;
    };

    _this.toggleDrawerVisibility = function (event) {
      _this.setState(function (state, props) {
        return {
          filtersDrawerVisible: !state.filtersDrawerVisible
        };
      });
    };

    _this.onSearchAllClient = function (e) {
      var matched = [];

      if (e.length === 0) {
        matched = _this.props.dataSource;
      } else {
        matched = _this.props.dataSource.filter(function (record) {
          var stringValues = Object.values(record).map(function (v) {
            return "" + v;
          });
          var found = stringValues.some(function (val) {
            return val.toLowerCase().includes(e.toLowerCase());
          });
          return found;
        });
      }

      _this.setState(function (state, props) {
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

    _this.buildSenderButton = function () {
      return React.createElement(_Button, {
        key: "query-sender-button",
        tabIndex: "1",
        type: "primary",
        style: {
          marginTop: "1em"
        },
        onClick: _this.sendFilterQuery
      }, "Search");
    };

    _this.state = {
      isFilterEnabled: false,
      dataSource: _this.props.dataSource,
      clientFilterBy: new Map(),
      visibleFilters: new Map(),
      filtersContent: new Map(),
      filtersDrawerVisible: false
    };
    _this.inputSearchRef = React.createRef();
    return _this;
  }

  var _proto = ListFilter.prototype;

  _proto.render = function render() {
    var _this$props3 = this.props,
        autoBuildFilters = _this$props3.autoBuildFilters,
        renderList = _this$props3.renderList,
        withFilterPicker = _this$props3.withFilterPicker;
    return React.createElement("div", {
      className: "list-filter-container"
    }, React.createElement(_Card, {
      className: "list-filters"
    }, React.createElement(_Drawer, {
      closable: true,
      mask: false,
      onClose: this.closeFiltersDrawer,
      visible: this.state.filtersDrawerVisible
    }, React.createElement("div", {
      className: "filters-content"
    }, this.showFiltersInDrawer())), React.createElement("div", {
      className: "filter-controls"
    }, React.createElement("div", {
      className: "filter-controls-left"
    }, withFilterPicker && React.createElement("div", {
      className: "filter-picker"
    }, React.createElement(_Tooltip, {
      placement: "left",
      title: (this.state.filtersDrawerVisible ? 'Hide' : 'Show') + " Filters"
    }, React.createElement(_Button, {
      style: {
        margin: "0.3em"
      },
      type: "primary",
      shape: "circle",
      onClick: this.toggleDrawerVisibility
    }, React.createElement(_Icon, {
      type: "filter"
    }))), !autoBuildFilters && React.createElement(_Popover, {
      placement: 'bottom',
      trigger: "hover",
      content: this.filterSelectionContent()
    }, React.createElement(_Tooltip, {
      placement: "right",
      title: "Available Filters"
    }, React.createElement(_Button, {
      type: "circle"
    }, React.createElement(_Icon, {
      type: "bars"
    }))))), this.state.isFilterEnabled && React.createElement(_Button, {
      onClick: this.clearFilters,
      style: {
        margin: "0.3em"
      },
      type: "danger",
      icon: "close"
    }, "Clear")), React.createElement("div", {
      className: "filter-controls-right"
    }, React.createElement(SearchAllBar, {
      clearText: !this.state.isFilterEnabled,
      onSearch: this.onSearchAllClient
    })))), renderList(this.state.dataSource));
  };

  return ListFilter;
}(React.Component);

ListFilter.propTypes = {
  dataFields: PropTypes.objectOf(PropTypes.shape({
    type: PropTypes.oneOf(["simplestring", "autocomplete", "multiselect", "number", "date", "bool"]).isRequired,
    uiName: PropTypes.string.isRequired,
    format: PropTypes.string,
    dataSource: PropTypes.array,
    nullValue: PropTypes.any
  })).isRequired,
  savedVisibleFilters: PropTypes.array,
  dataSource: PropTypes.arrayOf(Object).isRequired,
  autoBuildFilters: PropTypes.bool,
  renderList: PropTypes.func.isRequired,
  excludeFields: PropTypes.arrayOf(PropTypes.string),
  withFilterPicker: PropTypes.bool
};
ListFilter.defaultProps = {
  withFilterPicker: true,
  autoBuildFilters: false
};

var ServerFilter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(ServerFilter, _React$Component);

  function ServerFilter(_props) {
    var _this;

    _this = _React$Component.call(this, _props) || this;

    _this.componentDidMount = function () {
      var autoBuildFilters = _this.props.autoBuildFilters;
      if (autoBuildFilters) _this.autoBuildFilterContent();
    };

    _this.resetDataSource = function () {
      _this.setState(function (state, props) {
        return {
          dataSource: props.dataSource
        };
      });
    };

    _this.mapFiltersToServer = function () {
      var serverFilters = [];

      for (var _iterator = _this.state.clientFilterBy, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var entry = _ref;
        var key = entry[0],
            value = entry[1];
        var field = _this.props.dataFields[key];
        var serverFilter = {
          Name: key,
          Type: getFieldType(field),
          Values: Array.isArray(value) ? value : [value]
        };
        serverFilters.push(serverFilter);
      }

      return serverFilters;
    };

    _this.discardExcludedFields = function (fieldNames) {
      var fieldNamesExcluded = [].concat(fieldNames);
      var excludeFields = _this.props.excludeFields;

      if (excludeFields && excludeFields.length > 0) {
        fieldNamesExcluded = fieldNamesExcluded.filter(function (fieldName) {
          return !excludeFields.includes(fieldName);
        });
      }

      return fieldNamesExcluded;
    };

    _this.decideFiltersToBuild = function () {
      var dataSource = _this.props.dataSource;
      var visibleFilters = _this.state.visibleFilters;

      if (visibleFilters.size > 0) {
        return Array.from(visibleFilters.keys());
      } else {
        var allfieldNames = Object.keys(dataSource[0]);
        return _this.discardExcludedFields(allfieldNames);
      }
    };

    _this.autoBuildFilterContent = function () {
      var dataFields = _this.props.dataFields;

      var filtersToBuild = _this.decideFiltersToBuild();

      var filtersContent = new Map();
      filtersToBuild.forEach(function (name) {
        var field = dataFields[name];
        var fieldDataSource = getFieldDataSource(dataFields[name]);

        if (field.type === "autocomplete") {
          filtersContent.set(name, buildAutocompleteFilters(name, field, fieldDataSource, _this.setStringInputFilter));
        }

        if (field.type === "simplestring") filtersContent.set(name, buildStringInputFilters(name, field, fieldDataSource, _this.setStringInputFilter));

        if (field.type === "multiselect") {
          filtersContent.set(name, buildMultiSelectFilters(name, field, fieldDataSource, _this.setMultiSelectFilter));
        }

        if (field.type === "number") filtersContent.set(name, buildNumberFilters(name, field, fieldDataSource, _this.setNumberFilter));
        if (field.type === "bool") filtersContent.set(name, buildBooleanFilters(name, field, fieldDataSource, _this.setBooleanFilter));
        if (field.type === "date") filtersContent.set(name, buildDateFilters(name, field, fieldDataSource, _this.setDateFilter));
      });

      _this.setState(function (state, props) {
        return {
          filtersContent: filtersContent
        };
      });
    };

    _this.manualBuildFilterContent = function (fieldName) {
      var dataFields = _this.props.dataFields;
      var field = dataFields[fieldName];
      var filterElement;

      if (field.type === "autocomplete") {
        var fieldDataSource = getFieldDataSource(field, true);
        filterElement = buildAutocompleteFilters(fieldName, field, fieldDataSource, _this.setStringInputFilter);
      }

      if (field.type === "simplestring") {
        var _fieldDataSource = getFieldDataSource(field, false);

        filterElement = buildStringInputFilters(fieldName, field, _fieldDataSource, _this.setStringInputFilter);
      }

      if (field.type === "multiselect") {
        var _fieldDataSource2 = getFieldDataSource(field, true);

        filterElement = buildMultiSelectFilters(fieldName, field, _fieldDataSource2, _this.setMultiSelectFilter);
      }

      if (field.type === "number") {
        var _fieldDataSource3 = getFieldDataSource(field, false);

        filterElement = buildNumberFilters(fieldName, field, _fieldDataSource3, _this.setNumberFilter);
      }

      if (field.type === "bool") {
        var _fieldDataSource4 = getFieldDataSource(field, false);

        filterElement = buildBooleanFilters(fieldName, field, _fieldDataSource4, _this.setBooleanFilter);
      }

      if (field.type === "date") {
        var _fieldDataSource5 = getFieldDataSource(field, false);

        filterElement = buildDateFilters(fieldName, field, _fieldDataSource5, _this.setDateFilter);
      }

      var filtersContent = _this.state.filtersContent;
      if (filtersContent.has(fieldName)) filtersContent.delete(fieldName);else filtersContent.set(fieldName, filterElement);

      _this.setState(function (state, props) {
        return {
          filtersContent: filtersContent
        };
      });
    };

    _this.setDateFilter = function (_ref2, name) {
      var operator = _ref2.operator,
          date = _ref2.date;
      var clientFilterBy = _this.state.clientFilterBy;
      var key = getFieldKey(_this.props.dataFields, name);
      var value = operator + " " + date;
      if (!date) clientFilterBy.delete(key);else clientFilterBy.set(key, value);

      _this.setState({
        clientFilterBy: clientFilterBy
      });
    };

    _this.setNumberFilter = function (_ref3, name) {
      var operator = _ref3.operator,
          number = _ref3.number;
      var clientFilterBy = _this.state.clientFilterBy;
      var key = getFieldKey(_this.props.dataFields, name);
      var value = operator + " " + number;
      if (!number) clientFilterBy.delete(key);else clientFilterBy.set(key, value);

      _this.setState({
        clientFilterBy: clientFilterBy
      });
    };

    _this.setStringInputFilter = function (_ref4, name) {
      var value = _ref4.value;
      var clientFilterBy = _this.state.clientFilterBy;
      var key = getFieldKey(_this.props.dataFields, name);
      if (!value) clientFilterBy.delete(key);else clientFilterBy.set(key, value);

      _this.setState({
        clientFilterBy: clientFilterBy
      });
    };

    _this.setMultiSelectFilter = function (_ref5, name, stringValues) {
      var values = _ref5.values;
      var clientFilterBy = _this.state.clientFilterBy;
      var key = getFieldKey(_this.props.dataFields, name);
      var actualValues = values.map(function (val) {
        return stringValues[val];
      });
      if (!actualValues || actualValues.length === 0) clientFilterBy.delete(key);else clientFilterBy.set(key, actualValues);

      _this.setState({
        clientFilterBy: clientFilterBy
      });
    };

    _this.setBooleanFilter = function (_ref6, name) {
      var value = _ref6.value;
      var clientFilterBy = _this.state.clientFilterBy;
      var key = getFieldKey(_this.props.dataFields, name);
      if (!value || value === " - ") clientFilterBy.delete(key);else clientFilterBy.set(key, value);

      _this.setState({
        clientFilterBy: clientFilterBy
      });
    };

    _this.closeFiltersDrawer = function () {
      _this.setState(function (state, props) {
        return {
          filtersDrawerVisible: false
        };
      });
    };

    _this.toggleFilterSelection = function (e) {
      var _e$target = e.target,
          name = _e$target.name,
          checked = _e$target.checked;
      var _this$state = _this.state,
          visibleFilters = _this$state.visibleFilters,
          clientFilterBy = _this$state.clientFilterBy;
      visibleFilters.set(name, checked);
      var filterByClone = clientFilterBy;
      if (filterByClone.has(name)) filterByClone.delete(name);

      _this.setState(function (state, props) {
        return {
          visibleFilters: visibleFilters,
          clientFilterBy: filterByClone
        };
      });

      _this.manualBuildFilterContent(name);
    };

    _this.filterSelectionContent = function () {
      var allfields = Object.keys(_this.props.dataSource[0]);

      var filteredFields = _this.discardExcludedFields(allfields);

      var fieldCheckBoxes = filteredFields.map(function (key) {
        return React.createElement(_Checkbox, {
          name: key,
          key: key + "-filter-selection",
          checked: _this.state.visibleFilters.get(key),
          onChange: _this.toggleFilterSelection
        }, getFieldUIName(_this.props.dataFields[key]));
      });
      return React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }
      }, fieldCheckBoxes);
    };

    _this.clearFilters = function (event) {
      _this.setState(function (state, props) {
        return {
          isFilterEnabled: false,
          dataSource: props.dataSource,
          ServerFilterBy: [],
          FilteredData: [],
          clientFilterBy: new Map(),
          filtersContent: new Map()
        };
      }, _this.autoBuildFilterContent);
    };

    _this.showFiltersInDrawer = function () {
      var filterElements = [];

      for (var _iterator2 = _this.state.filtersContent.values(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref7;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref7 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref7 = _i2.value;
        }

        var value = _ref7;
        filterElements.push(value);
      }

      if (filterElements.length > 0) filterElements.push(_this.buildSenderButton());
      if (filterElements.length === 0) filterElements.push(React.createElement("p", {
        key: "no-items"
      }, " No Items "));
      return filterElements;
    };

    _this.toggleDrawerVisibility = function (event) {
      _this.setState(function (state, props) {
        return {
          filtersDrawerVisible: !state.filtersDrawerVisible
        };
      });
    };

    _this.onSearchAllServer =
    /*#__PURE__*/
    function () {
      var _ref8 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(e) {
        var ServerFilterBy, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                ServerFilterBy = [{
                  Name: "ALL",
                  Type: null,
                  Values: [e.toLowerCase()]
                }];

                _this.setState(function (state, props) {
                  return {
                    ServerFilterBy: ServerFilterBy,
                    visibleFilters: props.savedVisibleFilters || new Map(),
                    filtersContent: new Map(),
                    filtersDrawerVisible: false,
                    isFilterEnabled: true,
                    isSearching: true
                  };
                });

                _context.next = 4;
                return _this.props.onPostFilters(ServerFilterBy);

              case 4:
                result = _context.sent;

                _this.setState(function (state, props) {
                  return {
                    FilteredData: result,
                    isSearching: false
                  };
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref8.apply(this, arguments);
      };
    }();

    _this.buildSenderButton = function () {
      return React.createElement(_Button, {
        tabIndex: "1",
        key: "query-sender-button",
        loading: _this.state.isSearching,
        type: "primary",
        style: {
          marginTop: "1em"
        },
        onClick: _this.handleServerFiltering
      }, "Search");
    };

    _this.handleServerFiltering =
    /*#__PURE__*/
    function () {
      var _ref9 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(event) {
        var ServerFilterBy, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                ServerFilterBy = _this.mapFiltersToServer();

                _this.setState(function (state, props) {
                  return {
                    ServerFilterBy: ServerFilterBy,
                    isFilterEnabled: true,
                    isSearching: true
                  };
                });

                _context2.next = 4;
                return _this.props.onPostFilters(ServerFilterBy);

              case 4:
                result = _context2.sent;

                _this.setState({
                  FilteredData: result,
                  isSearching: false
                });

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref9.apply(this, arguments);
      };
    }();

    _this.renderListComponent = function (renderList) {
      var _this$state2 = _this.state,
          ServerFilterBy = _this$state2.ServerFilterBy,
          isSearching = _this$state2.isSearching,
          dataSource = _this$state2.dataSource,
          FilteredData = _this$state2.FilteredData;
      return ServerFilterBy.length > 0 ? isSearching ? renderList(dataSource, true) : renderList(FilteredData, false) : renderList(dataSource, false);
    };

    _this.state = {
      isSearching: false,
      isFilterEnabled: false,
      dataSource: _this.props.dataSource,
      clientFilterBy: new Map(),
      ServerFilterBy: [],
      FilteredData: [],
      visibleFilters: new Map(),
      filtersContent: new Map(),
      filtersDrawerVisible: false
    };
    _this.inputSearchRef = React.createRef();
    return _this;
  }

  var _proto = ServerFilter.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        autoBuildFilters = _this$props.autoBuildFilters,
        renderList = _this$props.renderList,
        withFilterPicker = _this$props.withFilterPicker;
    return React.createElement("div", {
      className: "list-filter-container"
    }, React.createElement(_Card, {
      className: "list-filters"
    }, React.createElement(_Drawer, {
      closable: true,
      mask: false,
      onClose: this.closeFiltersDrawer,
      visible: this.state.filtersDrawerVisible
    }, React.createElement("div", {
      className: "filters-content"
    }, this.showFiltersInDrawer())), React.createElement("div", {
      className: "filter-controls"
    }, React.createElement("div", {
      className: "filter-controls-left"
    }, withFilterPicker && React.createElement("div", {
      className: "filter-picker"
    }, React.createElement(_Tooltip, {
      placement: "left",
      title: (this.state.filtersDrawerVisible ? 'Hide' : 'Show') + " Filters"
    }, React.createElement(_Button, {
      style: {
        margin: "0.3em"
      },
      type: "primary",
      shape: "circle",
      onClick: this.toggleDrawerVisibility
    }, React.createElement(_Icon, {
      type: "filter"
    }))), !autoBuildFilters && React.createElement(_Popover, {
      placement: 'bottom',
      trigger: "hover",
      content: this.filterSelectionContent()
    }, React.createElement(_Tooltip, {
      placement: "right",
      title: "Available Filters"
    }, React.createElement(_Button, {
      type: "circle"
    }, React.createElement(_Icon, {
      type: "bars"
    }))))), this.state.isFilterEnabled && React.createElement(_Button, {
      onClick: this.clearFilters,
      style: {
        margin: "0.3em"
      },
      type: "danger",
      icon: "close"
    }, "Clear")), React.createElement("div", {
      className: "filter-controls-right"
    }, React.createElement(SearchAllBar, {
      clearText: this.state.isFilterEnabled && this.state.ServerFilterBy[0] && this.state.ServerFilterBy[0].Name !== "ALL",
      onSearch: this.onSearchAllServer
    })))), this.renderListComponent(renderList));
  };

  return ServerFilter;
}(React.Component);

ServerFilter.propTypes = {
  dataFields: PropTypes.objectOf(PropTypes.shape({
    type: PropTypes.oneOf(["simplestring", "autocomplete", "multiselect", "number", "date", "bool"]).isRequired,
    uiName: PropTypes.string.isRequired,
    format: PropTypes.string,
    dataSource: PropTypes.array.isRequired,
    nullValue: PropTypes.any
  }).isRequired).isRequired,
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
  autoBuildFilters: false
};

var ClientFilter = ListFilter;
var ServerFilter$1 = ServerFilter;
var index$5 = {
  ClientFilter: ClientFilter,
  ServerFilter: ServerFilter$1
};

export default index$5;
export { ClientFilter, ServerFilter$1 as ServerFilter };
