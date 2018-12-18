import React, { Component } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forecastMode: 0,
            cityId: ""
        };
    }

    setForecastMode = (e, mode) => {
        e.preventDefault();
        this.setState({
            forecastMode: mode
        });
        console.log(this.state);
    };

    render() {
        return (
            <div className="container container-fluid">
                <Header handleMenuItem = {this.setForecastMode.bind(this)}/>
                <Main forecastMode = {this.state.forecastMode} cityId = {this.state.cityId}/>
                <Footer />
            </div>
        );
    }
}

export default App;
