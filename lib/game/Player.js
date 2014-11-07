function Player(_sprite) {
    //this.hpMax = 100;
    //this.hp;  // current_hp
    this.lives = 3; //digit
    this.sprite = _sprite; 
    this.lamp = true;  //bool
    this.score = 0; //current_score
    //this.fuel;  
    //this.fuelMax = 5;

    this.interact = function() {};

    this.move = function() {};

    this.jump = function() {};

    this.changeLifes = function(value) {
        switch(value) {
            case 1:
                this.lives = this.lives + 1;
                break;
            case -1:
                if (this.lives == 1){
                    this.die();
                } else {
                    this.lives = this.lives - 1;
                }
                break;
        }
    };
    /*
    this.changeFuel = function(value) {
        switch(value) {
            case 1:
                this.fuel = this.fuel + 1;
                break;
            case -1:
                if (this.fuel == 1){
                    this.die();
                } else {
                    this.fuel = this.fuel - 1;
                }
                break;
        }
    };
    */
    this.die = function(){
        //magic happens here
    };
}