import React, { Component } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forecastMode: 0,
            cityId: 0
        };
    }

    setForecastMode = (e, mode) => {
        e.preventDefault();
        this.setState({
            forecastMode: mode
        });
        // TOdo: убрать нажатия впустую( при выбранном текущем пункте меню)
        // console.log(this.state);    //TODO: --
    };

    setCityId = (cityId) => {
        this.setState({cityId});
        // console.log(this.state);    //TODO: --
    };

    render() {
        return (
            <div className="container container-fluid">
                <Header handleMenuItem = {this.setForecastMode} handleButtonClick = {this.setCityId} />
                <Main forecastMode = {this.state.forecastMode} cityId = {this.state.cityId} />
                <Footer />
            </div>
        );
    }
}

export default App;
