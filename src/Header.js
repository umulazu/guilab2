import React from "react";

const Header = () => (
    <div id="menu-container">
        {/*menu*/}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="navbar-header">
                <a className="navbar-brand" href="../public/index.html">Погода в городе</a>
                {/*collapsed menu*/}
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>

                {/* SEARCHING FOR CITY*/}
                <form name="form_container" className="navbar-form navbar-left">
                    <div className="form-group">
                        <input type="text" id="textboxCity" className="form-control" placeholder="Москва" required pattern="[А-Яа-я ]{1,15}" size="15"/>
                    </div>
                    <button type="submit" className="btn btn-default">Найти</button>
                </form>
            </div>
            {/*Collect the nav links, forms, and other content for toggling*/}
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <a className="nav-item nav-link nav__mode_current-day active" href="../public/index.html">Сегодня <span className="sr-only">(current)</span></a>
                    <a className="nav-item nav-link nav__mode_3-day" href="../public/index.html">На 3 дня</a>
                    <a className="nav-item nav-link nav__mode_5-day" href="../public/index.html">На 5 дней</a>
                </div>
            </div>
            {/*/.navbar-collapse*/}
        </nav>
    </div>
);



export default Header;