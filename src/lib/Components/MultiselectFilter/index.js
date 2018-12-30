import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

class MultiSelectFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            values: []
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        this.props.onChange(this.state)
    }

    handleChange = (values) => {
        this.setState((state, props) => {
            return { values }
        });
    }

    render() {

        const { name, dataSource } = this.props;

        return (
            <div className="ant-filter-container">
                <span>{name}</span>
                <div className="filter-content">
                    <Select
                        style={{minWidth:200, width:'100%'}}
                        allowClear={true}
                        onChange={this.handleChange}
                        mode="multiple"
                        key={name}
                        placeholder={name}>
                        {dataSource}
                    </Select>
                </div>
            </div>
        )
    }
}

MultiSelectFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    dataSource: PropTypes.array
}

export default MultiSelectFilter;