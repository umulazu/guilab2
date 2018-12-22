import React, { Component } from 'react';


//запасной token appid=a48628e4534c9233dc2e2b44dde18f60
class Main extends Component {
    render() {
        console.log(this.props.cityId);
        let modeContainer = null;
        switch (this.props.forecastMode) {
            case 1:
                modeContainer = <CurrentWeather cityId = {this.props.cityId}/>;
                break;
            case 3:
                modeContainer = <ForecastForThreeDays cityId = {this.props.cityId}/>;
                break;
            case 5:
                modeContainer = <ForecastForFiveDays cityId = {this.props.cityId}/>;
                break;
            default:
                modeContainer = null;
        }
        return (
            <div>
                {console.log(this.props.cityId + " " + this.props.forecastMode)}
                {modeContainer}
            </div>
        )
    }
}

function checkWeatherImage(weatherJSON) {
    const id = weatherJSON["weather"][0]["id"];
    let src ="";
    switch (true) {
        case id >= 200 && id <= 232:
            src = require("./img/11d.png");
            break;
        case id >= 300 && id <= 332:
            src = require("./img/09d.png")
            break;
        case id >= 500 && id <= 532:
            let hoursIs = (new Date()).getHours();
            if (hoursIs > 7 && hoursIs < 19) src = require("./img/10d.png"); else src = require("./img/10n.png");
            break;
        case id >= 600 && id <= 632:
            src = require("./img/13d.png");
            break;
        case id >= 700 && id <= 781:
            src = require("./img/50d.png");
            break;
        case id === 800:
            hoursIs = (new Date()).getHours();
            if (hoursIs > 7 && hoursIs < 19) src = require("./img/01d.png"); else src = require("./img/01n.png");
            break;
        case id === 801:
            hoursIs = (new Date()).getHours();
            if (hoursIs > 7 && hoursIs < 19) src = require("./img/02d.png"); else src = require("./img/02n.png");
            break;
        case id === 802:
            src = require("./img/03d.png");
            break;
        case id >= 803 && id <= 804:
            src = require("./img/04d.png");
            break;
        default:
            src = require("./img/01d.png")
    }
    return <img src={src} alt="png"/>;
}
function checkDate(dt) {
    return dt.slice(5, 11);
}

class Day extends  React.Component {
    handleClick = (flag) => {
        if (flag) {
            this.props.handleClickOnDay(-1);
        } else {
            this.props.handleClickOnDay(this.props.index);
        }
    };

    render() {
        let {day, weatherJSON, index, idOfActiveDay} = this.props;
        let isActive = idOfActiveDay === index;
        let forRender = isActive ? (
            <div className="col" onClick={this.handleClick.bind(this, isActive)}>
                <div className="row justify-content-center">
                    <p>{checkDate(day["dt_txt"])}</p>
                </div>
                <hr></hr>
                <h2>Ночь: {~~(day["main"]["temp"] - 273.15)}&#176;C</h2>
                <p>{checkWeatherImage(day)}</p>
                <hr></hr>
                <h2>День: {~~(weatherJSON["list"][index+5]["main"]["temp"] - 273.15)}&#176;C</h2>
                <p>{checkWeatherImage(weatherJSON["list"][index+5])}</p>
                <hr></hr>
                <b><u>Средняя температура: </u></b><h2>{~~((day["main"]["temp"] - 2 * 273.15 + weatherJSON["list"][index+5]["main"]["temp"]) / 2)}&#176;C</h2>
                <p><i>{day["weather"][0]["description"]}</i></p>
                <hr></hr>
                <p><u>Скорость ветра:</u> {day["wind"]["speed"]} м/сек</p>
                <p><u>Влажность:</u> {day["main"]["humidity"]}%</p>
                <p><u>Видимость:</u> {day["main"]["pressure"]}%</p>
            </div>
        ) : (
            <div className="col" onClick={this.handleClick.bind(this, isActive)}>
                <div className="row justify-content-center">
                    <p>{checkDate(day["dt_txt"])}</p>
                </div>
                <hr></hr>
                <h2>Ночь: {~~(day["main"]["temp"] - 273.15)}&#176;C</h2>
                <p>{checkWeatherImage(day)}</p>
                <hr></hr>
                <h2>День: {~~(weatherJSON["list"][index+5]["main"]["temp"] - 273.15)}&#176;C</h2>
                <p>{checkWeatherImage(weatherJSON["list"][index+5])}</p>
                <hr></hr>
                <p><i>{day["weather"][0]["description"]}</i></p>
            </div>
        );

        return (forRender);
    }
}

// 3 modes
class CurrentWeather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            weatherJSON: {},
            error: null
        }
    }

    fetchCurrentWeather(cityId) {
        // Where we're fetching data from
        fetch(`http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=b725faec3be149931cdf9b6773e4f321&lang=ru`)
        // We get the API response and receive data in JSON format...
            .then(response => response.json())
            // ...then we update the CurrentWeathers state
            .then(data => {
                // myjson = JSON.stringify(data);
                console.log(`устанавливаем state в fetche: ${JSON.stringify(data)}`);
                this.setState({
                    weatherJSON: data,
                    isLoading: false,
                });
                console.log(`state.isLoading в fetche: ${this.state.isLoading}`);

            })
            // Catch any errors we hit and update the app
            .catch(error => this.setState({ error, isLoading: false }));

        // //TODO: на некоторое время отключим API
        // this.setState({
        //     weatherJSON: {"coord":{"lon":39.87,"lat":57.63},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"base":"stations","main":{"temp":266.15,"pressure":1037,"humidity":79,"temp_min":266.15,"temp_max":266.15},"visibility":9000,"wind":{"speed":4,"deg":180},"clouds":{"all":90},"dt":1545161400,"sys":{"type":1,"id":9023,"message":0.1176,"country":"RU","sunrise":1545112832,"sunset":1545136460},"id":468902,"name":"Yaroslavl","cod":200},
        //     isLoading:false
        // });
    }

    componentDidMount() {
        console.log("didMOUNT");
        let cityId = this.props.cityId;
        this.fetchCurrentWeather(cityId);
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        console.log("did update");
        if (this.props.cityId !== prevProps.cityId) {
            let cityId = this.props.cityId;
            this.fetchCurrentWeather(cityId);
        }
    }

    render() {
        console.log("rendering");
        const { isLoading, weatherJSON, error } = this.state;
        return (
            <React.Fragment>
                <div className=" row justify-content-center"><h1>Сейчас</h1></div>
                {error ? <p>{error.message}</p> : null}
                {!isLoading ? (
                    <div key={weatherJSON["dt"]} className = "container col-md-6 ">
                        <hr></hr>
                        <div className="row justify-content-md-center">
                            Обновлено в {(new Date()).getHours()}:{(new Date()).getMinutes()}
                        </div>
                        <hr></hr>
                        <div className="row justify-content-md-center">
                            <div className="col-md-2">
                                <h2>{~~(weatherJSON["main"]["temp"] - 273.15)}&#176;C</h2>
                            </div>
                            <div className="col-md-2" >
                                {checkWeatherImage(weatherJSON)}
                            </div>
                        </div>
                        <hr></hr>
                        <div className="row justify-content-md-center">
                            <div className="col-md-auto">
                                <i>{weatherJSON["weather"][0]["description"]}</i>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="row justify-content-md-center">
                            <div className="col-md-auto">Ветер: {weatherJSON["wind"]["speed"]} м/сек</div>
                            <div className="col-md-auto">Давление: {~~(0.75*weatherJSON["main"]["pressure"])} мм. рт. ст.</div>
                            <div className="col-md-auto">Влажность: {weatherJSON["main"]["humidity"]} %</div>
                        </div>
                    </div>
                ) : (
                    <h3>Загрузка...</h3>
                )}
            </React.Fragment>
        );
    }
}
class ForecastForThreeDays extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            weatherJSON: {},
            error: null
        }
    }

    fetchThreeDaysForecast(cityId) {
        // Where we're fetching data from
        fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=a48628e4534c9233dc2e2b44dde18f60&lang=ru`)
        // We get the API response and receive data in JSON format...
            .then(response => response.json())
            // ...then we update the CurrentWeathers state
            .then(data => {
                this.setState({
                    weatherJSON: data,
                    isLoading: false,
                });
            })
            // Catch any errors we hit and update the app
            .catch(error => this.setState({ error, isLoading: false }));

        //TODO: на некоторое время отключим API
        // this.setState({
        //     weatherJSON: {"cod":"200","message":0.0036,"cnt":40,"list":[{"dt":1485799200,"main":{"temp":261.45,"temp_min":259.086,"temp_max":261.45,"pressure":1023.48,"sea_level":1045.39,"grnd_level":1023.48,"humidity":79,"temp_kf":2.37},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"02n"}],"clouds":{"all":8},"wind":{"speed":4.77,"deg":232.505},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-01-30 18:00:00"},{"dt":1485810000,"main":{"temp":261.41,"temp_min":259.638,"temp_max":261.41,"pressure":1022.41,"sea_level":1044.35,"grnd_level":1022.41,"humidity":76,"temp_kf":1.78},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":32},"wind":{"speed":4.76,"deg":240.503},"snow":{"3h":0.011},"sys":{"pod":"n"},"dt_txt":"2017-01-30 21:00:00"},{"dt":1485820800,"main":{"temp":261.76,"temp_min":260.571,"temp_max":261.76,"pressure":1021.34,"sea_level":1043.21,"grnd_level":1021.34,"humidity":84,"temp_kf":1.18},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":68},"wind":{"speed":4.71,"deg":243},"snow":{"3h":0.058},"sys":{"pod":"n"},"dt_txt":"2017-01-31 00:00:00"},{"dt":1485831600,"main":{"temp":261.46,"temp_min":260.865,"temp_max":261.46,"pressure":1019.95,"sea_level":1041.79,"grnd_level":1019.95,"humidity":82,"temp_kf":0.59},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":68},"wind":{"speed":4.46,"deg":244.5},"snow":{"3h":0.05225},"sys":{"pod":"n"},"dt_txt":"2017-01-31 03:00:00"},{"dt":1485842400,"main":{"temp":260.981,"temp_min":260.981,"temp_max":260.981,"pressure":1018.96,"sea_level":1040.84,"grnd_level":1018.96,"humidity":81,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":80},"wind":{"speed":4.21,"deg":245.005},"snow":{"3h":0.19625},"sys":{"pod":"d"},"dt_txt":"2017-01-31 06:00:00"},{"dt":1485853200,"main":{"temp":262.308,"temp_min":262.308,"temp_max":262.308,"pressure":1018.1,"sea_level":1039.77,"grnd_level":1018.1,"humidity":91,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":88},"wind":{"speed":4.1,"deg":249.006},"snow":{"3h":0.535},"sys":{"pod":"d"},"dt_txt":"2017-01-31 09:00:00"},{"dt":1485864000,"main":{"temp":263.76,"temp_min":263.76,"temp_max":263.76,"pressure":1016.86,"sea_level":1038.4,"grnd_level":1016.86,"humidity":87,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":68},"wind":{"speed":3.87,"deg":254.5},"snow":{"3h":0.21},"sys":{"pod":"d"},"dt_txt":"2017-01-31 12:00:00"},{"dt":1485874800,"main":{"temp":264.182,"temp_min":264.182,"temp_max":264.182,"pressure":1016.19,"sea_level":1037.77,"grnd_level":1016.19,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":76},"wind":{"speed":3.67,"deg":257.001},"snow":{"3h":0.1375},"sys":{"pod":"n"},"dt_txt":"2017-01-31 15:00:00"},{"dt":1485885600,"main":{"temp":264.67,"temp_min":264.67,"temp_max":264.67,"pressure":1015.32,"sea_level":1036.94,"grnd_level":1015.32,"humidity":86,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":88},"wind":{"speed":3.61,"deg":262.503},"snow":{"3h":0.1425},"sys":{"pod":"n"},"dt_txt":"2017-01-31 18:00:00"},{"dt":1485896400,"main":{"temp":265.436,"temp_min":265.436,"temp_max":265.436,"pressure":1014.27,"sea_level":1035.76,"grnd_level":1014.27,"humidity":90,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":80},"wind":{"speed":3.67,"deg":266.5},"snow":{"3h":0.1625},"sys":{"pod":"n"},"dt_txt":"2017-01-31 21:00:00"},{"dt":1485907200,"main":{"temp":266.104,"temp_min":266.104,"temp_max":266.104,"pressure":1013.1,"sea_level":1034.62,"grnd_level":1013.1,"humidity":90,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":80},"wind":{"speed":3.81,"deg":269.004},"snow":{"3h":0.1025},"sys":{"pod":"n"},"dt_txt":"2017-02-01 00:00:00"},{"dt":1485918000,"main":{"temp":266.904,"temp_min":266.904,"temp_max":266.904,"pressure":1011.96,"sea_level":1033.47,"grnd_level":1011.96,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":76},"wind":{"speed":4.26,"deg":274.002},"snow":{"3h":0.12},"sys":{"pod":"n"},"dt_txt":"2017-02-01 03:00:00"},{"dt":1485928800,"main":{"temp":268.102,"temp_min":268.102,"temp_max":268.102,"pressure":1011.23,"sea_level":1032.62,"grnd_level":1011.23,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":76},"wind":{"speed":4.4,"deg":283.501},"snow":{"3h":0.13},"sys":{"pod":"d"},"dt_txt":"2017-02-01 06:00:00"},{"dt":1485939600,"main":{"temp":270.269,"temp_min":270.269,"temp_max":270.269,"pressure":1010.85,"sea_level":1032.1,"grnd_level":1010.85,"humidity":92,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":64},"wind":{"speed":4.53,"deg":297.5},"snow":{"3h":0.1875},"sys":{"pod":"d"},"dt_txt":"2017-02-01 09:00:00"},{"dt":1485950400,"main":{"temp":270.585,"temp_min":270.585,"temp_max":270.585,"pressure":1010.49,"sea_level":1031.65,"grnd_level":1010.49,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":76},"wind":{"speed":4.31,"deg":302.004},"snow":{"3h":0.065},"sys":{"pod":"d"},"dt_txt":"2017-02-01 12:00:00"},{"dt":1485961200,"main":{"temp":269.661,"temp_min":269.661,"temp_max":269.661,"pressure":1010.22,"sea_level":1031.49,"grnd_level":1010.22,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":68},"wind":{"speed":4.91,"deg":296.5},"snow":{"3h":0.0825},"sys":{"pod":"n"},"dt_txt":"2017-02-01 15:00:00"},{"dt":1485972000,"main":{"temp":269.155,"temp_min":269.155,"temp_max":269.155,"pressure":1009.95,"sea_level":1031.3,"grnd_level":1009.95,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":80},"wind":{"speed":5.7,"deg":310.501},"snow":{"3h":0.11},"sys":{"pod":"n"},"dt_txt":"2017-02-01 18:00:00"},{"dt":1485982800,"main":{"temp":268.056,"temp_min":268.056,"temp_max":268.056,"pressure":1011.21,"sea_level":1032.49,"grnd_level":1011.21,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":68},"wind":{"speed":5.56,"deg":333},"snow":{"3h":0.225},"sys":{"pod":"n"},"dt_txt":"2017-02-01 21:00:00"},{"dt":1485993600,"main":{"temp":265.803,"temp_min":265.803,"temp_max":265.803,"pressure":1013.79,"sea_level":1035.06,"grnd_level":1013.79,"humidity":83,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":8},"wind":{"speed":4.8,"deg":355.004},"snow":{"3h":0.03},"sys":{"pod":"n"},"dt_txt":"2017-02-02 00:00:00"},{"dt":1486004400,"main":{"temp":263.381,"temp_min":263.381,"temp_max":263.381,"pressure":1015.66,"sea_level":1037.16,"grnd_level":1015.66,"humidity":84,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":4.2,"deg":348.503},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-02 03:00:00"},{"dt":1486015200,"main":{"temp":261.85,"temp_min":261.85,"temp_max":261.85,"pressure":1017.63,"sea_level":1039.22,"grnd_level":1017.63,"humidity":76,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":3.81,"deg":345.502},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-02 06:00:00"},{"dt":1486026000,"main":{"temp":263.455,"temp_min":263.455,"temp_max":263.455,"pressure":1019.32,"sea_level":1040.84,"grnd_level":1019.32,"humidity":84,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":3.06,"deg":344.004},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-02 09:00:00"},{"dt":1486036800,"main":{"temp":264.015,"temp_min":264.015,"temp_max":264.015,"pressure":1020.41,"sea_level":1041.88,"grnd_level":1020.41,"humidity":85,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":2.52,"deg":334.501},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-02 12:00:00"},{"dt":1486047600,"main":{"temp":259.684,"temp_min":259.684,"temp_max":259.684,"pressure":1021.52,"sea_level":1043.21,"grnd_level":1021.52,"humidity":76,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":2.48,"deg":320.501},"snow":{"3h":0.0024999999999999},"sys":{"pod":"n"},"dt_txt":"2017-02-02 15:00:00"},{"dt":1486058400,"main":{"temp":255.188,"temp_min":255.188,"temp_max":255.188,"pressure":1022.09,"sea_level":1044.09,"grnd_level":1022.09,"humidity":66,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":24},"wind":{"speed":1.23,"deg":283.003},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-02 18:00:00"},{"dt":1486069200,"main":{"temp":255.594,"temp_min":255.594,"temp_max":255.594,"pressure":1022.03,"sea_level":1044.12,"grnd_level":1022.03,"humidity":64,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":48},"wind":{"speed":1.22,"deg":244.502},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-02 21:00:00"},{"dt":1486080000,"main":{"temp":256.96,"temp_min":256.96,"temp_max":256.96,"pressure":1021.8,"sea_level":1043.77,"grnd_level":1021.8,"humidity":66,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":44},"wind":{"speed":1.23,"deg":237.506},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-03 00:00:00"},{"dt":1486090800,"main":{"temp":258.109,"temp_min":258.109,"temp_max":258.109,"pressure":1020.97,"sea_level":1042.99,"grnd_level":1020.97,"humidity":77,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":80},"wind":{"speed":1.21,"deg":234.502},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-03 03:00:00"},{"dt":1486101600,"main":{"temp":259.533,"temp_min":259.533,"temp_max":259.533,"pressure":1020.56,"sea_level":1042.53,"grnd_level":1020.56,"humidity":76,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":68},"wind":{"speed":1.21,"deg":229.509},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-03 06:00:00"},{"dt":1486112400,"main":{"temp":263.438,"temp_min":263.438,"temp_max":263.438,"pressure":1020.46,"sea_level":1042.15,"grnd_level":1020.46,"humidity":84,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":56},"wind":{"speed":1.51,"deg":242.503},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-03 09:00:00"},{"dt":1486123200,"main":{"temp":264.228,"temp_min":264.228,"temp_max":264.228,"pressure":1019.58,"sea_level":1041.24,"grnd_level":1019.58,"humidity":89,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":56},"wind":{"speed":1.58,"deg":242.503},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-03 12:00:00"},{"dt":1486134000,"main":{"temp":261.153,"temp_min":261.153,"temp_max":261.153,"pressure":1019.63,"sea_level":1041.42,"grnd_level":1019.63,"humidity":80,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":76},"wind":{"speed":1.21,"deg":198.501},"snow":{"3h":0.0049999999999999},"sys":{"pod":"n"},"dt_txt":"2017-02-03 15:00:00"},{"dt":1486144800,"main":{"temp":258.818,"temp_min":258.818,"temp_max":258.818,"pressure":1020.18,"sea_level":1042.03,"grnd_level":1020.18,"humidity":73,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":64},"wind":{"speed":1.21,"deg":209.002},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-03 18:00:00"},{"dt":1486155600,"main":{"temp":257.218,"temp_min":257.218,"temp_max":257.218,"pressure":1020.43,"sea_level":1042.38,"grnd_level":1020.43,"humidity":65,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":44},"wind":{"speed":1.17,"deg":194.501},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-03 21:00:00"},{"dt":1486166400,"main":{"temp":255.782,"temp_min":255.782,"temp_max":255.782,"pressure":1020.57,"sea_level":1042.75,"grnd_level":1020.57,"humidity":73,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":56},"wind":{"speed":1.21,"deg":175.001},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-04 00:00:00"},{"dt":1486177200,"main":{"temp":254.819,"temp_min":254.819,"temp_max":254.819,"pressure":1020.99,"sea_level":1043.11,"grnd_level":1020.99,"humidity":68,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":44},"wind":{"speed":1.22,"deg":122.001},"snow":{"3h":0.0049999999999999},"sys":{"pod":"n"},"dt_txt":"2017-02-04 03:00:00"},{"dt":1486188000,"main":{"temp":257.488,"temp_min":257.488,"temp_max":257.488,"pressure":1021.31,"sea_level":1043.48,"grnd_level":1021.31,"humidity":63,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":68},"wind":{"speed":2.13,"deg":155.501},"snow":{"3h":0.04},"sys":{"pod":"d"},"dt_txt":"2017-02-04 06:00:00"},{"dt":1486198800,"main":{"temp":259.827,"temp_min":259.827,"temp_max":259.827,"pressure":1021.81,"sea_level":1043.67,"grnd_level":1021.81,"humidity":90,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":68},"wind":{"speed":2.07,"deg":170.005},"snow":{"3h":0.03},"sys":{"pod":"d"},"dt_txt":"2017-02-04 09:00:00"},{"dt":1486209600,"main":{"temp":261.256,"temp_min":261.256,"temp_max":261.256,"pressure":1021.31,"sea_level":1043.05,"grnd_level":1021.31,"humidity":86,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":76},"wind":{"speed":2.32,"deg":175.001},"snow":{"3h":0.0049999999999999},"sys":{"pod":"d"},"dt_txt":"2017-02-04 12:00:00"},{"dt":1486220400,"main":{"temp":260.26,"temp_min":260.26,"temp_max":260.26,"pressure":1021,"sea_level":1042.96,"grnd_level":1021,"humidity":86,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":56},"wind":{"speed":2.47,"deg":180.501},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-04 15:00:00"}],"city":{"id":524901,"name":"Moscow","coord":{"lat":55.7522,"lon":37.6156},"country":"none"}},
        //     isLoading:false
        // });
    }

    componentDidMount() {
        let cityId = this.props.cityId;
        this.fetchThreeDaysForecast(cityId);
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        console.log("did update");
        if (this.props.cityId !== prevProps.cityId) {
            let cityId = this.props.cityId;
            this.fetchThreeDaysForecast(cityId);
        }
    }


    render() {
        const { isLoading, weatherJSON, error } = this.state;
        return (
            <div className="container">
                <div className="row justify-content-center"><div className="col-md-auto"><h1>Прогноз на 3 дня</h1></div></div>
                <div className="row justify-content-center">
                    <p>Сегодня {(new Date()).getDate()} {(new Date()).toLocaleString('ru', {month: 'short'})}</p>
                </div>
                <hr></hr>
                <div className="row ">
                    {error ? <p>{error.message}</p> : null}
                    {!isLoading ? (
                        weatherJSON["list"].slice(0, 24).map((day, index) => {
                            if (index % 8 === 0) {
                                return (
                                    <div key={day["dt"]} className="col">
                                        <div className="row justify-content-center">
                                            <div className="col-auto">{checkDate(day["dt_txt"])}</div>
                                        </div>
                                        <hr></hr>
                                        <div className="row justify-content-center">
                                            <div className="col-auto"><b>Ночь:</b> <h2>{~~(day["main"]["temp"] - 273.15)}&#176;C</h2></div>
                                            <div className="col-auto">{checkWeatherImage(day)}</div>
                                        </div>
                                        <hr></hr>
                                        <div className="row justify-content-center">
                                            <div className="col-auto"><b>День:</b> <h2>{~~(weatherJSON["list"][index+5]["main"]["temp"] - 273.15)}&#176;C</h2></div>
                                            <div className="col-auto">{checkWeatherImage(weatherJSON["list"][index+5])}</div>
                                        </div>
                                        <hr></hr>
                                        <div className="row justify-content-center">
                                            <div className="col auto"><i>{day["weather"][0]["description"]}</i></div>
                                            <div className="col auto">Ветер: {day["wind"]["speed"]} м/сек</div>
                                            <div className="col auto">Влажность: {day["main"]["humidity"]}%</div>
                                        </div>
                                        <hr></hr>
                                    </div>
                                )
                            } else {
                                return null;
                            }
                        })
                    ) : (
                        <h3>Загрузка...</h3>
                    )}
                </div>
            </div>
        );
    }
}
class ForecastForFiveDays extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOfActiveDay: -1,
            isLoading: true,
            weatherJSON: {},
            error: null
        }
    }

    handleClickOnDay = (id) => {
        this.setState({idOfActiveDay: id});
    };

    fetchFiveDaysForecast(cityId) {
        // Where we're fetching data from
        fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=a48628e4534c9233dc2e2b44dde18f60&lang=ru`)
        // We get the API response and receive data in JSON format...
            .then(response => response.json())
            // ...then we update the CurrentWeathers state
            .then(data => {
                this.setState({
                    weatherJSON: data,
                    isLoading: false,
                });
            })
            // Catch any errors we hit and update the app
            .catch(error => this.setState({ error, isLoading: false }));

        //TODO: на некоторое время отключим API
        // this.setState({
        //     weatherJSON: {"cod":"200","message":0.0036,"cnt":40,"list":[{"dt":1485799200,"main":{"temp":261.45,"temp_min":259.086,"temp_max":261.45,"pressure":1023.48,"sea_level":1045.39,"grnd_level":1023.48,"humidity":79,"temp_kf":2.37},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"02n"}],"clouds":{"all":8},"wind":{"speed":4.77,"deg":232.505},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-01-30 18:00:00"},{"dt":1485810000,"main":{"temp":261.41,"temp_min":259.638,"temp_max":261.41,"pressure":1022.41,"sea_level":1044.35,"grnd_level":1022.41,"humidity":76,"temp_kf":1.78},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":32},"wind":{"speed":4.76,"deg":240.503},"snow":{"3h":0.011},"sys":{"pod":"n"},"dt_txt":"2017-01-30 21:00:00"},{"dt":1485820800,"main":{"temp":261.76,"temp_min":260.571,"temp_max":261.76,"pressure":1021.34,"sea_level":1043.21,"grnd_level":1021.34,"humidity":84,"temp_kf":1.18},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":68},"wind":{"speed":4.71,"deg":243},"snow":{"3h":0.058},"sys":{"pod":"n"},"dt_txt":"2017-01-31 00:00:00"},{"dt":1485831600,"main":{"temp":261.46,"temp_min":260.865,"temp_max":261.46,"pressure":1019.95,"sea_level":1041.79,"grnd_level":1019.95,"humidity":82,"temp_kf":0.59},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":68},"wind":{"speed":4.46,"deg":244.5},"snow":{"3h":0.05225},"sys":{"pod":"n"},"dt_txt":"2017-01-31 03:00:00"},{"dt":1485842400,"main":{"temp":260.981,"temp_min":260.981,"temp_max":260.981,"pressure":1018.96,"sea_level":1040.84,"grnd_level":1018.96,"humidity":81,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":80},"wind":{"speed":4.21,"deg":245.005},"snow":{"3h":0.19625},"sys":{"pod":"d"},"dt_txt":"2017-01-31 06:00:00"},{"dt":1485853200,"main":{"temp":262.308,"temp_min":262.308,"temp_max":262.308,"pressure":1018.1,"sea_level":1039.77,"grnd_level":1018.1,"humidity":91,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":88},"wind":{"speed":4.1,"deg":249.006},"snow":{"3h":0.535},"sys":{"pod":"d"},"dt_txt":"2017-01-31 09:00:00"},{"dt":1485864000,"main":{"temp":263.76,"temp_min":263.76,"temp_max":263.76,"pressure":1016.86,"sea_level":1038.4,"grnd_level":1016.86,"humidity":87,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":68},"wind":{"speed":3.87,"deg":254.5},"snow":{"3h":0.21},"sys":{"pod":"d"},"dt_txt":"2017-01-31 12:00:00"},{"dt":1485874800,"main":{"temp":264.182,"temp_min":264.182,"temp_max":264.182,"pressure":1016.19,"sea_level":1037.77,"grnd_level":1016.19,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":76},"wind":{"speed":3.67,"deg":257.001},"snow":{"3h":0.1375},"sys":{"pod":"n"},"dt_txt":"2017-01-31 15:00:00"},{"dt":1485885600,"main":{"temp":264.67,"temp_min":264.67,"temp_max":264.67,"pressure":1015.32,"sea_level":1036.94,"grnd_level":1015.32,"humidity":86,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":88},"wind":{"speed":3.61,"deg":262.503},"snow":{"3h":0.1425},"sys":{"pod":"n"},"dt_txt":"2017-01-31 18:00:00"},{"dt":1485896400,"main":{"temp":265.436,"temp_min":265.436,"temp_max":265.436,"pressure":1014.27,"sea_level":1035.76,"grnd_level":1014.27,"humidity":90,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":80},"wind":{"speed":3.67,"deg":266.5},"snow":{"3h":0.1625},"sys":{"pod":"n"},"dt_txt":"2017-01-31 21:00:00"},{"dt":1485907200,"main":{"temp":266.104,"temp_min":266.104,"temp_max":266.104,"pressure":1013.1,"sea_level":1034.62,"grnd_level":1013.1,"humidity":90,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":80},"wind":{"speed":3.81,"deg":269.004},"snow":{"3h":0.1025},"sys":{"pod":"n"},"dt_txt":"2017-02-01 00:00:00"},{"dt":1485918000,"main":{"temp":266.904,"temp_min":266.904,"temp_max":266.904,"pressure":1011.96,"sea_level":1033.47,"grnd_level":1011.96,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":76},"wind":{"speed":4.26,"deg":274.002},"snow":{"3h":0.12},"sys":{"pod":"n"},"dt_txt":"2017-02-01 03:00:00"},{"dt":1485928800,"main":{"temp":268.102,"temp_min":268.102,"temp_max":268.102,"pressure":1011.23,"sea_level":1032.62,"grnd_level":1011.23,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":76},"wind":{"speed":4.4,"deg":283.501},"snow":{"3h":0.13},"sys":{"pod":"d"},"dt_txt":"2017-02-01 06:00:00"},{"dt":1485939600,"main":{"temp":270.269,"temp_min":270.269,"temp_max":270.269,"pressure":1010.85,"sea_level":1032.1,"grnd_level":1010.85,"humidity":92,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":64},"wind":{"speed":4.53,"deg":297.5},"snow":{"3h":0.1875},"sys":{"pod":"d"},"dt_txt":"2017-02-01 09:00:00"},{"dt":1485950400,"main":{"temp":270.585,"temp_min":270.585,"temp_max":270.585,"pressure":1010.49,"sea_level":1031.65,"grnd_level":1010.49,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":76},"wind":{"speed":4.31,"deg":302.004},"snow":{"3h":0.065},"sys":{"pod":"d"},"dt_txt":"2017-02-01 12:00:00"},{"dt":1485961200,"main":{"temp":269.661,"temp_min":269.661,"temp_max":269.661,"pressure":1010.22,"sea_level":1031.49,"grnd_level":1010.22,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":68},"wind":{"speed":4.91,"deg":296.5},"snow":{"3h":0.0825},"sys":{"pod":"n"},"dt_txt":"2017-02-01 15:00:00"},{"dt":1485972000,"main":{"temp":269.155,"temp_min":269.155,"temp_max":269.155,"pressure":1009.95,"sea_level":1031.3,"grnd_level":1009.95,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":80},"wind":{"speed":5.7,"deg":310.501},"snow":{"3h":0.11},"sys":{"pod":"n"},"dt_txt":"2017-02-01 18:00:00"},{"dt":1485982800,"main":{"temp":268.056,"temp_min":268.056,"temp_max":268.056,"pressure":1011.21,"sea_level":1032.49,"grnd_level":1011.21,"humidity":89,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":68},"wind":{"speed":5.56,"deg":333},"snow":{"3h":0.225},"sys":{"pod":"n"},"dt_txt":"2017-02-01 21:00:00"},{"dt":1485993600,"main":{"temp":265.803,"temp_min":265.803,"temp_max":265.803,"pressure":1013.79,"sea_level":1035.06,"grnd_level":1013.79,"humidity":83,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13n"}],"clouds":{"all":8},"wind":{"speed":4.8,"deg":355.004},"snow":{"3h":0.03},"sys":{"pod":"n"},"dt_txt":"2017-02-02 00:00:00"},{"dt":1486004400,"main":{"temp":263.381,"temp_min":263.381,"temp_max":263.381,"pressure":1015.66,"sea_level":1037.16,"grnd_level":1015.66,"humidity":84,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":4.2,"deg":348.503},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-02 03:00:00"},{"dt":1486015200,"main":{"temp":261.85,"temp_min":261.85,"temp_max":261.85,"pressure":1017.63,"sea_level":1039.22,"grnd_level":1017.63,"humidity":76,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":3.81,"deg":345.502},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-02 06:00:00"},{"dt":1486026000,"main":{"temp":263.455,"temp_min":263.455,"temp_max":263.455,"pressure":1019.32,"sea_level":1040.84,"grnd_level":1019.32,"humidity":84,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":3.06,"deg":344.004},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-02 09:00:00"},{"dt":1486036800,"main":{"temp":264.015,"temp_min":264.015,"temp_max":264.015,"pressure":1020.41,"sea_level":1041.88,"grnd_level":1020.41,"humidity":85,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":2.52,"deg":334.501},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-02 12:00:00"},{"dt":1486047600,"main":{"temp":259.684,"temp_min":259.684,"temp_max":259.684,"pressure":1021.52,"sea_level":1043.21,"grnd_level":1021.52,"humidity":76,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":2.48,"deg":320.501},"snow":{"3h":0.0024999999999999},"sys":{"pod":"n"},"dt_txt":"2017-02-02 15:00:00"},{"dt":1486058400,"main":{"temp":255.188,"temp_min":255.188,"temp_max":255.188,"pressure":1022.09,"sea_level":1044.09,"grnd_level":1022.09,"humidity":66,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":24},"wind":{"speed":1.23,"deg":283.003},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-02 18:00:00"},{"dt":1486069200,"main":{"temp":255.594,"temp_min":255.594,"temp_max":255.594,"pressure":1022.03,"sea_level":1044.12,"grnd_level":1022.03,"humidity":64,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":48},"wind":{"speed":1.22,"deg":244.502},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-02 21:00:00"},{"dt":1486080000,"main":{"temp":256.96,"temp_min":256.96,"temp_max":256.96,"pressure":1021.8,"sea_level":1043.77,"grnd_level":1021.8,"humidity":66,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":44},"wind":{"speed":1.23,"deg":237.506},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-03 00:00:00"},{"dt":1486090800,"main":{"temp":258.109,"temp_min":258.109,"temp_max":258.109,"pressure":1020.97,"sea_level":1042.99,"grnd_level":1020.97,"humidity":77,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":80},"wind":{"speed":1.21,"deg":234.502},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-03 03:00:00"},{"dt":1486101600,"main":{"temp":259.533,"temp_min":259.533,"temp_max":259.533,"pressure":1020.56,"sea_level":1042.53,"grnd_level":1020.56,"humidity":76,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":68},"wind":{"speed":1.21,"deg":229.509},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-03 06:00:00"},{"dt":1486112400,"main":{"temp":263.438,"temp_min":263.438,"temp_max":263.438,"pressure":1020.46,"sea_level":1042.15,"grnd_level":1020.46,"humidity":84,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":56},"wind":{"speed":1.51,"deg":242.503},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-03 09:00:00"},{"dt":1486123200,"main":{"temp":264.228,"temp_min":264.228,"temp_max":264.228,"pressure":1019.58,"sea_level":1041.24,"grnd_level":1019.58,"humidity":89,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":56},"wind":{"speed":1.58,"deg":242.503},"snow":{},"sys":{"pod":"d"},"dt_txt":"2017-02-03 12:00:00"},{"dt":1486134000,"main":{"temp":261.153,"temp_min":261.153,"temp_max":261.153,"pressure":1019.63,"sea_level":1041.42,"grnd_level":1019.63,"humidity":80,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":76},"wind":{"speed":1.21,"deg":198.501},"snow":{"3h":0.0049999999999999},"sys":{"pod":"n"},"dt_txt":"2017-02-03 15:00:00"},{"dt":1486144800,"main":{"temp":258.818,"temp_min":258.818,"temp_max":258.818,"pressure":1020.18,"sea_level":1042.03,"grnd_level":1020.18,"humidity":73,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":64},"wind":{"speed":1.21,"deg":209.002},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-03 18:00:00"},{"dt":1486155600,"main":{"temp":257.218,"temp_min":257.218,"temp_max":257.218,"pressure":1020.43,"sea_level":1042.38,"grnd_level":1020.43,"humidity":65,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":44},"wind":{"speed":1.17,"deg":194.501},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-03 21:00:00"},{"dt":1486166400,"main":{"temp":255.782,"temp_min":255.782,"temp_max":255.782,"pressure":1020.57,"sea_level":1042.75,"grnd_level":1020.57,"humidity":73,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":56},"wind":{"speed":1.21,"deg":175.001},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-04 00:00:00"},{"dt":1486177200,"main":{"temp":254.819,"temp_min":254.819,"temp_max":254.819,"pressure":1020.99,"sea_level":1043.11,"grnd_level":1020.99,"humidity":68,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":44},"wind":{"speed":1.22,"deg":122.001},"snow":{"3h":0.0049999999999999},"sys":{"pod":"n"},"dt_txt":"2017-02-04 03:00:00"},{"dt":1486188000,"main":{"temp":257.488,"temp_min":257.488,"temp_max":257.488,"pressure":1021.31,"sea_level":1043.48,"grnd_level":1021.31,"humidity":63,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":68},"wind":{"speed":2.13,"deg":155.501},"snow":{"3h":0.04},"sys":{"pod":"d"},"dt_txt":"2017-02-04 06:00:00"},{"dt":1486198800,"main":{"temp":259.827,"temp_min":259.827,"temp_max":259.827,"pressure":1021.81,"sea_level":1043.67,"grnd_level":1021.81,"humidity":90,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":68},"wind":{"speed":2.07,"deg":170.005},"snow":{"3h":0.03},"sys":{"pod":"d"},"dt_txt":"2017-02-04 09:00:00"},{"dt":1486209600,"main":{"temp":261.256,"temp_min":261.256,"temp_max":261.256,"pressure":1021.31,"sea_level":1043.05,"grnd_level":1021.31,"humidity":86,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":76},"wind":{"speed":2.32,"deg":175.001},"snow":{"3h":0.0049999999999999},"sys":{"pod":"d"},"dt_txt":"2017-02-04 12:00:00"},{"dt":1486220400,"main":{"temp":260.26,"temp_min":260.26,"temp_max":260.26,"pressure":1021,"sea_level":1042.96,"grnd_level":1021,"humidity":86,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":56},"wind":{"speed":2.47,"deg":180.501},"snow":{},"sys":{"pod":"n"},"dt_txt":"2017-02-04 15:00:00"}],"city":{"id":524901,"name":"Moscow","coord":{"lat":55.7522,"lon":37.6156},"country":"none"}},
        //     isLoading:false
        // });
    }

    componentDidMount() {
        let cityId = this.props.cityId;
        this.fetchFiveDaysForecast(cityId);
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        console.log("did update");
        if (this.props.cityId !== prevProps.cityId) {
            let cityId = this.props.cityId;
            this.fetchFiveDaysForecast(cityId);
        }
    }

    render() {
        const { isLoading, weatherJSON, error } = this.state;
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <h1>Прогноз на 5 дней</h1>
                </div>
                <div className="row justify-content-center">
                    <p>Сегодня {(new Date()).getDate()} {(new Date()).toLocaleString('ru', {month: 'short'})}</p>
                </div>
                <hr></hr>

                {error ? <p>{error.message}</p> : null}
                <div className="row justify-content-center">
                    {!isLoading ? (
                        weatherJSON["list"].map((day, index) => {
                            if (index % 8 === 0) {
                                return (
                                    <Day key={day["dt"]}
                                         day = {day}
                                         index = {index}
                                         weatherJSON = {weatherJSON}
                                         handleClickOnDay = {this.handleClickOnDay}
                                         idOfActiveDay = {this.state.idOfActiveDay}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })
                    ) : (
                        <h3>Загрузка...</h3>
                    )}
                </div>
            </React.Fragment>
        );
    }
}


export default Main;