import React from 'react';
import { AutoComplete } from 'antd';
import PropTypes from 'prop-types';

class AutoCompleteFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: null
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        this.props.onChange(this.state);
    }

    handleChange = (value) => {
        
        this.setState((state, props) => {
            return { value }
        });
    }

    render() {
        const { name, dataSource } = this.props;

        return (
            <div 
                className="ant-filter-container"
                style={{width:'100%'}}>
                <span>{name}</span>
                <div 
                    className="filter-content"
                    style={{display: 'flex',width:'100%'}}>
                <AutoComplete
                    ref={this.inputRef}
                    style={{width:'100%', minWidth:200}}
                    allowClear={true}
                    key={name}
                    onChange={this.handleChange}
                    dataSource={dataSource}
                    placeholder={name} />
                </div> 
            </div>
        )
    }
}

AutoCompleteFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    dataSource: PropTypes.array
}

export default AutoCompleteFilter;