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

    setForecastMode = (e, mode) => {
        e.preventDefault();
        e.target.closest(".navbar-nav").querySelector(".active").className = e.target.closest(".navbar-nav").querySelector(".active").className.replace(/ active/, "");
        e.target.className += " active";

        this.setState({
            forecastMode: mode
        });
        // TOdo: убрать нажатия впустую( при выбранном текущем пункте меню)
        // console.log(this.state);    //TODO: --
    };

    setCityId = (cityId) => {
        this.setState({cityId});
        // console.log("устанавливаем cityId в App:" + this.state.cityId);    //TODO: --
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
