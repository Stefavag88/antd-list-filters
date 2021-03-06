import React  from 'react';
import { InputNumber, Select } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;

class NumberFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            operator: "==",
            number: null
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        this.props.onChange(this.state)
    }

    handleChange = (value) => {

        if (typeof value === 'string') {
            this.setState((state, props) => {
                return { operator: value }
            });
        } else {
            this.setState((state, props) => {
                return { number: value }
            });
        }

    }

    render() {

        const { name, min, max } = this.props;

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
                        <Option value=">=">{' >= '}</Option>
                        <Option value="<=">{' <= '}</Option>
                        <Option value=">">{' > '}</Option>
                        <Option value="<">{' < '} </Option>
                        <Option value="==">{' = '}</Option>
                        <Option value="!=">{' != '}</Option>
                    </Select>
                    <InputNumber
                        className="filter-value"
                        style={{marginLeft:'0.3em', width:'100%'}}
                        onChange={this.handleChange}
                        key={name}
                        placeholder={name}
                        min={min}
                        max={max} />
                </div>
            </div>
        )
    }
}

NumberFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    min: PropTypes.number,
    max: PropTypes.number
}

export default NumberFilter;