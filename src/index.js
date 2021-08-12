import React, { Component } from "react";
import ReactDOM from "react-dom";

import {GameCore} from "./components/game.js"

//main component
class App extends Component {
    render() {
        return(
            <div className="App">
                <GameCore/>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById("root")
)