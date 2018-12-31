import React from 'react';
import { DatePicker, Select } from 'antd';
import PropTypes from 'prop-types';
import fnsFormatDate from 'date-fns/format';
import fnsParseDate from 'date-fns/parse';
import fnsIsValid from 'date-fns/is_valid';

const Option = Select.Option;
const prepareDate = (date, format) => fnsFormatDate(fnsParseDate(date), format);
const isValidDate = date => fnsIsValid(fnsParseDate(date));

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
                value.forEach(val => {
                    if (!isValidDate(val)) return;
                    dates.push(prepareDate(val, this.props.format));
                })
            } else {
                if (!isValidDate(value)) return;
                dates.push(prepareDate(value, this.props.format));
            }

            this.setState((state, props) => {
                return { date: [...dates] }
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
                style={{marginLeft:'0.3em', width:'100%'}}
                placeholder={this.props.name}
                onChange={this.handleChange} />
        }
    }

    render() {

        const { name } = this.props;

        return (
            <div 
                className="ant-filter-container"
                style={{width:'100%'}}>
                <span>{name}</span>
                <div 
                    className="filter-content"
                    style={{display: 'flex',width:'100%'}}>
                    <Select
                        className="operator-value"
                        defaultValue="=="
                        onChange={this.handleChange}>
                        <Option value=">">{' > '}</Option>
                        <Option value="<">{' < '}</Option>
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