import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

class BooleanFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: null
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        this.props.onChange(this.state)
    }

    handleChange = (value) => {
        this.setState((state, props) => {
            return { value }
        });
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
                        style={{ minWidth: 200, width:'100%' }}
                        allowClear={true}
                        key={name}
                        onChange={this.handleChange}
                        placeholder={name}>
                        <Select.Option key={true}>YES</Select.Option>
                        <Select.Option key={false}>NO</Select.Option>
                        <Select.Option key={' - '}> - </Select.Option>
                    </Select>
                </div>
            </div>
        )
    }
}

BooleanFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
}

export default BooleanFilter;