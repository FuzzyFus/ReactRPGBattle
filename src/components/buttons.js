import React, { Component } from "react";

export class ButtonHandler extends Component {
    constructor(props){
        super(props);
        this.state = {
            //0 = none, 1 = attack, 2 = utility
            dropdownMenu:0
        };
    }
    
    showSubMenu = (id) => {
        if (this.state.dropdownMenu.id === id) id = 0;
        this.setState({ dropdownMenu:id });
    }

    render() {
        return(
            <div className="Buttons">
                <div className="topButtons">
                    <button id="attackButton"
                        type="button" 
                        onClick={() => this.showSubMenu(1)}
                        >
                        Attack
                    </button>
                    <button id="utilityButton"
                        type="button" 
                        onClick={() => this.showSubMenu(2)}
                        >
                        Utility
                    </button>
                </div>
                <div className="dropdownMenus">
                    {this.state.dropdownMenu === 1 && <AttackMenu makeGameMove = {this.props.makeGameMove} 
                                                                  playerMana = {this.props.playerMana}
                                                                  gameFinished = {this.props.gameFinished}/>}
                    {this.state.dropdownMenu === 2 && <UtilityMenu makeGameMove = {this.props.makeGameMove} 
                                                                   playerMana = {this.props.playerMana} 
                                                                   playerHealth = {this.props.playerHealth}
                                                                   gameFinished = {this.props.gameFinished}/>}
                </div>
            </div>        
        );
    }
}

/////////////////////////////////////////////////

class AttackMenu extends Component {
    render() {
        return(
            <div className="attackMenu">
                <button id="a1Button"
                    type="button" 
                    disabled={this.props.gameFinished}
                    onClick={() => this.props.makeGameMove(1)}
                    >
                    Quick Slice
                </button>
                <button id="a2Button"
                    type="button" 
                    disabled={(this.props.playerMana < 30) || this.props.gameFinished}
                    onClick={() => this.props.makeGameMove(2)}
                    >
                    Buster Sword [30MP]
                </button>
                <button id="a3Button"
                    type="button" 
                    disabled={(this.props.playerMana < 15) || this.props.gameFinished}
                    onClick={() => this.props.makeGameMove(3)}
                    >
                    Fisticuffs [15MP]
                </button>
            </div>
        );
    }
}

class UtilityMenu extends Component {
    render() {
        return(
            <div className="utilityMenu">
                <button id="u1Button"
                    type="button" 
                    disabled={(this.props.playerMana < 30) || this.props.gameFinished}
                    onClick={() => this.props.makeGameMove(4)}
                    >
                    Knuckle Cracker [30MP]
                </button>
                <button id="u2Button"
                    type="button" 
                    disabled={(this.props.playerHealth < 75) || this.props.gameFinished}
                    onClick={() => this.props.makeGameMove(5)}
                    >
                    Mana Stim [75HP]
                </button>
                <button id="u2Button"
                    type="button" 
                    disabled={(this.props.playerMana < 40) || this.props.gameFinished}
                    onClick={() => this.props.makeGameMove(6)}
                    >
                    Health Stim [40MP]
                </button>
            </div>
        );
    }
}