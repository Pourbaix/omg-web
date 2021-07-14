import React, { Component } from 'react';
import ImportFileCard from "../components/Cards/ImportFileCard";

/**
 * "web page" import data. It displays the different methods of importing user's data
 */
class Import extends Component {
    render() {
        return (
            <div className="container-fluid d-flex ml-2 mr-2">
                <ImportFileCard/>
            </div>
        )
    }
}

export default Import;
