import React from "react";


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            city: "Ярославль"
        };
        this.input = React.createRef();
    };

    handleSubmitCity = (e) => {
        e.preventDefault();
        let value = this.input.current.value.toLowerCase();
        let cities = {
            "ярославль": 468902,
            "рыбинск": 500004,
            "кострома": 543878,
            "вологда": 472459,
            "москва": 524894,
            "санкт-петербург": 536203
        };

        if (!(cities.hasOwnProperty(value))) {
            alert("Введите известный город!");
            return null;
        }

        this.setState({
            city: value.charAt(0).toUpperCase() + value.slice(1)
        });
        this.props.handleButtonClick(cities[value]);
    };

    render() {
        return (
            <div id="menu-container">
                {/*menu*/}
                <nav className="navbar navbar-expand-lg navbar-light bg-light ">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="../public/index.html">Погода в городе {this.state.city}</a>
                        {/*collapsed menu*/}
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>

                        {/* SEARCHING FOR CITY*/}
                        <form name="form_container" className="navbar-form navbar-left" onSubmit={this.handleSubmitCity}>
                            <div className="form-group">
                                <input type="text" defaultValue={this.state.city} ref={this.input} className="form-control" required pattern="[А-Яа-я- ]{1,16}" size="16"/>
                            </div>
                            <button type="submit" className="btn btn-default">Найти</button>
                        </form>
                    </div>
                    {/*Collect the nav links, forms, and other content for toggling*/}
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <a className="nav-item nav-link nav__mode_current-day active" onClick={(e) => this.props.handleMenuItem(e, 1)} href="../public/index.html">Сейчас</a>
                            <a className="nav-item nav-link nav__mode_3-day" onClick={(e) => this.props.handleMenuItem(e, 3)} href="../public/index.html">На 3 дня</a>
                            <a className="nav-item nav-link nav__mode_5-day" onClick={(e) => this.props.handleMenuItem(e, 5)} href="../public/index.html">На 5 дней</a>
                        </div>
                    </div>
                    {/*/.navbar-collapse*/}
                </nav>
            </div>
        );
    }
}


export default Header;