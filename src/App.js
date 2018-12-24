import React, { Component } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forecastMode: 1,
            cityId: 468902
        };
    }

    setForecastMode = (mode) => {
        this.setState({
            forecastMode: mode
        });
    };

    setCityId = (cityId) => {
        this.setState({cityId});
    };

    render() {
        return (
            <div className={`container container-fluid`}>
                <Header handleMenuItem = {this.setForecastMode} handleButtonClick = {this.setCityId} />
                <Main forecastMode = {this.state.forecastMode} cityId = {this.state.cityId} />
                <Footer />
            </div>
        );
    }
}


export default App;
