var game = new Phaser.Game (380, 212, Phaser.AUTO, 'game');
game.state.add ('title', title);
game.state.add ('main', mainGameState);
hiScore = localStorage.getItem(localStorageName) == null ? 0 :
            localStorage.getItem(localStorageName);
game.state.start ('title');

setTimeout(function() { window.scrollTo(0, 1) }, 100);


