import React, { Component } from 'react';
import { Drawer } from 'antd';
import { PropTypes } from 'prop-types';


class FiltersDrawer extends Component {


    componentDidUpdate = (prevProps, prevState, snapShot) => {
        
    }

    render() {
        return (
            <Drawer
                closable={true}
                mask={false}
                onClose={this.closeFiltersDrawer}
                visible={this.state.filtersDrawerVisible}>
                {!this.state.updating &&
                    <div className="filters-content">
                        {this.showFiltersInDrawer()}
                    </div>}
            </Drawer>
        );
    }
}

FiltersDrawer.PropTypes = {
    onClose: PropTypes.func().isRequired,
    visible: PropTypes.bool.isRequired,
    content: PropTypes.instanceOf(Map).isRequired,
    changed: PropTypes.string
}

export default FiltersDrawer;