import React, { Component } from "react";
import {ButtonHandler} from "./buttons.js"
import testimg from "../images/test.jpg"

/* todos
look into map instead of switch statement
css?
*/

export class GameCore extends Component {
    constructor(){
        super();
        this.setGameCoreState = this.setState.bind(this);
        this.makeGameMove= this.makeGameMove.bind(this);
        this.state = {
            enemyHealth: 1000,
            playerHealth: 1000,
            playerMana: 0,
            lastUserMove: "start",
            lastEnemyMove: "none",
            luckMultiplier: 1,
            gameFinished: false
        }
    }
    
    render() {
        return(
            <div className="GameCore">
                <div className="finishOverlay">
                    <dialog open={this.state.gameFinished}>
                        You {(this.state.playerHealth > 0) ? "win!" : "lose!"}
                        <br/>
                        <button id="a1Button"
                            type="button" 
                            onClick={() => this.restartGame()}
                            >
                            Restart
                        </button>
                    </dialog>
                </div>

                <EnemyDisplay/>
                <TextDisplays gameCoreState = {this.state}/>
                <HealthDisplay gameCoreState = {this.state}/>
                <br/>
                { getQuip() }
                <ButtonHandler makeGameMove = {this.makeGameMove} 
                               playerMana = {this.state.playerMana}
                               playerHealth = {this.state.playerHealth}
                               gameFinished = {this.state.gameFinished}/>
            </div>
        );
    }

    makeGameMove(playerInput){
        console.log(`before\nEnemy Health:${this.state.enemyHealth} HP:${this.state.playerHealth} MP:${this.state.playerMana}`)
        this.playerMove(playerInput);
        this.enemyMove();
        console.log(`after\nEnemy Health:${this.state.enemyHealth} HP:${this.state.playerHealth} MP:${this.state.playerMana}`)
    }

    deadCheck(){
        console.log((this.state.playerHealth <= 0 || this.state.enemyHealth <= 0) ? "win!" : "lose!");
        if (this.state.playerHealth <= 0 || this.state.enemyHealth <= 0) this.setState({gameFinished: true});
    }

    enemyMove(){
        //variables to change for the setState
        let phVar = this.state.playerHealth;
        
        let rng = Math.floor(Math.random() * 3)
        switch(rng){
            case 0: //nothing
            this.setState({lastEnemyMove:"eAtk0"});
                break;
            case 1: //push
                phVar -= 50;
                this.setState({lastEnemyMove:"eAtk1"});
                break;
            case 2: //eva
                let rng = Math.floor(Math.random() * 5)
                if (rng === 0){
                    phVar -= 125;
                    this.setState({lastEnemyMove:"eAtk2C"});
                }
                else {
                    phVar -= 75;
                    this.setState({lastEnemyMove:"eAtk2"});
                }
                break;
            default:
                break;
        }
        this.setState({playerHealth: phVar}, () => {this.deadCheck() });
    }

    playerMove(input){
        // add 10 mp per move by default
        this.setState({playerMana: this.state.playerMana + 10});
        //remember rng starts at 0!
        //also playerMana uses its own setState so it can replace the default (gaining 10 mana)
        
        //variables to change for the setState
        let phVar = this.state.playerHealth;
        let ehVar = this.state.enemyHealth;

        switch(input){
            //attacks

            case 1: //quick slice
                ehVar -= 30;
                this.setState({lastUserMove:"uAtk1"})
                break;
            case 2: //buster sword
            {
                this.setState({playerMana: this.state.playerMana - 30});
                let rng = Math.floor(Math.random() * 5 * this.state.luckMultiplier);
                if (rng >= 4){ // 1/5 chance normally
                    ehVar -= 150;
                    this.setState({lastUserMove:"uAtk2C"})
                }
                else {
                    ehVar -= 75;
                    this.setState({lastUserMove:"uAtk2"})
                }
                this.setState({luckMultiplier: 1});
                break;
            }   
            case 3: //fisticuffs
            {
                this.setState({playerMana: this.state.playerMana - 15});
                let rng = Math.floor(Math.random() * 10 * this.state.luckMultiplier);
                if (rng >= 9){ // 1/10 chance normally
                    ehVar -= 500;
                    this.setState({lastUserMove:"uAtk3C"})
                }
                else {
                    ehVar -= 5;
                    this.setState({lastUserMove:"uAtk3"})
                }
                this.setState({luckMultiplier: 1});
                break;
            }  

            //utility

            case 4: // knuckle cracker, adds 1 to the luck multipler
                    this.setState({playerMana: this.state.playerMana - 30});
                    this.setState({luckMultiplier: this.state.luckMultiplier + 1});
                    this.setState({lastUserMove:"uUtil1"})
                break;
            case 5: // mana stim, takes 75hp for 15mp
                    phVar -= 75;
                    this.setState({playerMana: this.state.playerMana + 30});
                    this.setState({lastUserMove:"uUtil2"})
                break;

            default:
                break;
        }

        this.setState({
                        playerHealth: phVar,
                        enemyHealth: ehVar }, () => { this.deadCheck() });
    }

    restartGame(){
        this.setState({
            enemyHealth: 1000,
            playerHealth: 1000,
            playerMana: 0,
            lastUserMove: "start",
            lastEnemyMove: "none",
            luckMultiplier: 1,
            gameFinished: false
        })
    }
}

class HealthDisplay extends Component {
    render() {
        return(
            <div className="HealthDisplay">
                Enemy Health:{this.props.gameCoreState.enemyHealth}
                <br/>
                HP:{this.props.gameCoreState.playerHealth}
                <br/>
                MP:{this.props.gameCoreState.playerMana}
            </div>
        );
    }
}

class EnemyDisplay extends Component {
    render() {
        return(
            <div className="EnemyDisplay">
                <img src={testimg} alt="jake (enemy)" width="200" height="200"/>
            </div>        
        );
    } 
}

class TextDisplays extends Component {
    render() {
        return(
            <div className="Display"> 
            { getResponse(this.props.gameCoreState.lastUserMove) }
            <br/>
            { getResponse(this.props.gameCoreState.lastEnemyMove) }
            </div>
        );
    }
}

function getResponse(action) {
    let output = "";
    switch(action) {
        case "start": //default
            output = "A weeb approaches you, asking for a fight!"
            break;
        case "none": //default
            break;

        //user actions
        case "uAtk1": //quick slice
            output = "You quickly swipe your sword at them. [50DMG]"
            break;
        case "uAtk2": //buster sword
            output = "You swing your sword down on them, with a bit of fumbling. [65DMG]"
            break;
        case "uAtk2C":
            output = "Bracing yourself, you slash them hard! [125DMG]"
            break;
        case "uAtk3": //fisticuffs
            output = "You attempt to punch them, barely even gracing them. [5DMG]"
            break;
        case "uAtk3C":
            output = "Using all of your force, you give a shonen-anime type punch! [500DMG]"
            break;

        case "uUtil1": //knuckle cracker
            output = "You crack your knuckles, readying up for your next attack. [+1 LUCK]"
            break;
        case "uUtil2": //mana stim
            output = "You stab a syringe in your arm full of blue liquid. Probably dangerous, but meh. It's mana. [-75HP, +30 MANA]"
            break;
        case "uUtil3": //health stim (ditched but might return to it)
            output = "You stab a syringe in your arm full of red liquid. You start feeling better, even if your right tricep starts twitching. [+75HP, -40 MANA]"
            break;

        //enemy actions
        case "eAtk0": //nothing
            output = "They fumble around, looking nervous."
            break;
        case "eAtk1":
            output = "They give you a harsh push, mostly hurting your feelings. [-50HP]"
            break;
        case "eAtk2":
            output = "They toss a Blu-ray copy of Evangelion at you. That plastic cuts deep... [-40HP]"
            break;
        case "eAtk2C":
            output = "They toss a Blu-ray copy of Evangelion at you. The disc pops out, slicing your arm! [-125HP]"
            break;

        default:
            output = "invalid response"
    }
    return output;
}

function getQuip() {
    let output;
    let rng = Math.floor(Math.random()*3)
    switch(rng) {
        case 0:
            output = "He's just standing there... MENACINGLY!"
            break;
        case 1:
            output = "They bring out their phone and send a quick message off to their Minecraft girlfriend."
            break;
        case 2:
            output = "idk, third status"
            break;
        default:
            output = "invalid status"
    }
    return output;
}

export default GameCore;