import React from 'react';
import { DatePicker, Select } from 'antd';
import { PropTypes } from 'prop-types';
import moment from 'moment';

import './index.css';
const Option = Select.Option;

class DateFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            operator: '==',
            date: null
        }

        this.dateRef = React.createRef();
    }

    componentDidUpdate = (prevProps, prevState) => {
        this.props.onChange(this.state)
    }

    handleChange = (value) => {

        if (typeof value === 'string') {
            this.setState((state, props) => {
                return { operator: value, date: null }
            }, () => {
                this.dateRef.current.picker.clearSelection(new Event('clearEvent'));
            });
        } else {

            let dates = [];

            if (Array.isArray(value)) {
                console.log(value);
                value.forEach(val => {
                    console.log(val);
                    if (!moment(val).isValid()) return;
                    dates.push(moment(val));
                })
            } else {
                if (!moment(value).isValid()) return;
                dates.push(moment(value));
            }

            console.log(dates);

            this.setState((state, props) => {
                return { date: [...dates.map(dt => dt.format(this.props.format))] }
            });
        }
    }

    renderDatePicker = () => {
        if (this.state.operator === 'in') {
            return <DatePicker.RangePicker
                ref={this.dateRef}
                format={this.props.format}
                className="filter-value"
                placeholder={['From', 'To']}
                onChange={this.handleChange}
            />
        } else {
            return <DatePicker
                ref={this.dateRef}
                format={this.props.format}
                className="filter-value"
                placeholder={this.props.name}
                onChange={this.handleChange} />
        }
    }

    render() {

        const { name } = this.props;

        return (
            <div className="ant-filter-container">
                <span>{name}</span>
                <div className="filter-content">
                    <Select
                        className="operator-value"
                        defaultValue="=="
                        onChange={this.handleChange}>
                        <Option value=">=">{' >= '}</Option>
                        <Option value="<=">{' <= '}</Option>
                        <Option value="==">{' = '}</Option>
                        <Option value="in">{' in '}</Option>
                    </Select>
                    {this.renderDatePicker()}
                </div>
            </div>
        )
    }
}

DateFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    format: PropTypes.string
}

DateFilter.defaultProps = {
    format: 'YYYY-MM-DD',
}

export default DateFilter;