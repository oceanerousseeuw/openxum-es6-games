"use strict";

import MCTS from './node.mjs';

class Player {
    constructor(c, e, sn) {
        this._color = c;
        this._engine = e;
        this._simulation_number = sn;
        this._root = null;
    }

    move() {
        this._init_search();
        let move = this._monte_carlo_tree_search();
        return move;
    }

    _init_search() {
        this._root = new MCTS.Node(null, this._engine.clone(), this._engine.get_possible_move_list(), null);
    }

    _monte_carlo_tree_search() {
        for (let simulation = 0; simulation < this._simulation_number; simulation++) {

            let currentNode = this._root;

            //SELECTION
            while(currentNode.has_childrens()) {
                currentNode = currentNode.get_best_child();
            }

            if(!currentNode.has_childrens()){
                //EXPANSION - retrieve all the possible moves for the current node
                let possibleMoves = currentNode.get_possible_moves();
                for (let i = 0; i < possibleMoves.length; i++) {
                    //apply the move on a different engine
                    let newEngine = currentNode.get_engine().clone();
                    let move = possibleMoves[i];
                    newEngine.move(move);

                    //create a node with the engine modified
                    let newNode = new MCTS.Node(currentNode, newEngine, newEngine.get_possible_move_list(), move);
                    currentNode.add_children(newNode);
                }
            }

            let currentChildNodes = currentNode.get_all_childs();
            for (let i = 0; i < currentChildNodes.length; i++) {
                //SIMULATION - play random moves until the end of the game
                let winner = currentChildNodes[i].random_simulation();
                //UPDATE - update nodes depending on the color of the winner
                currentChildNodes[i].update(winner === this._color);
            }

        }

        return this._root.get_best_child().get_move();

    }
}


export default {
    Player: Player
};