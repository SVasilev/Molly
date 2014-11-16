//loads all states into object
var titleState = new TitleScreen(game);
var promoLevel = new PromoLevel(game);
game.state.add('titleScreen', titleState);
game.state.add('promoLevel', promoLevel);


