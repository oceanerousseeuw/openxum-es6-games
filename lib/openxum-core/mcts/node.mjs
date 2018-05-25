"use strict";

const KUCT = 0.25;

class Node {
    constructor(f, e, l, m) {
        this._father = f;
        this._engine = e;
        this._possibleMoves = l;
        this._move = m;
        this._numberVisits = 0;
        this._numberWins = 0;
        this._childNodes = [];
    }

    get_possible_moves() {
        return this._possibleMoves;
    }

    get_engine() {
        return this._engine;
    }

    get_move(){
        return this._move;
    }

    get_all_childs(){
        return this._childNodes;
    }

    get_visit_number(){
        return this._numberVisits;
    }

    has_childrens(){
        return this._childNodes !== null && this._childNodes.length > 0;
    }

    add_children(n) {
        this._childNodes.push(n);
    }

    update(isWin){
        if(isWin) {
            this._numberWins++;
        }
        this._numberVisits++;

        if(this._father !== null){
            this._father.update(isWin);
        }
    }

    random_simulation(){
        let newEngine = this._engine.clone();
        while(!newEngine.is_finished()) {
            let list = newEngine.get_possible_move_list();
            let move = list[Math.floor(Math.random() * list.length)];
            newEngine.move(move);
        }
        return newEngine.winner_is();
    }

    evaluate(){
        let exploitation = this._numberWins / this._numberVisits;
        let exploration = Math.sqrt(2 * Math.log(this._father.get_visit_number()) / this._numberVisits);

        return exploitation + KUCT * exploration;
    }

    get_best_child(){
        let bestChild = this;
        let bestScore = 0;
        for(let i = 0; i < this._childNodes.length; i++){
            let childScore = this._childNodes[i].evaluate();
            if(childScore >= bestScore){
                bestScore = childScore;
                bestChild = this._childNodes[i];
            }
        }
        return bestChild;
    }
}

export default {
    Node: Node
};