import React from 'react';
import { Input } from 'antd';
import { PropTypes } from 'prop-types';

import './index.css';

class StringInputFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: null
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        this.props.onChange(this.state);
    }

    handleChange = (event) => {

        const {value} = event.target; 

        this.setState((state, props) => {
            return { value }
        });
    }

    render() {

        const { name } = this.props;

        return (
            <div className="ant-filter-container">
                <span>{name}</span>
                <div className="filter-content">
                <Input
                    style={{width:'100%', minWidth:200}}
                    key={name}
                    onChange={this.handleChange}
                    placeholder={name} />
                </div> 
            </div>
        )
    }
}

StringInputFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
}

export default StringInputFilter;