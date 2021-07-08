class Form{
    constructor(){
       this.input = createInput("Name");
       this.button = createButton('Play');
       this.reset=createButton('Reset');
       this.greeting = createElement('h2');
       this.title = createElement('h2');
    }
    hide() {
        this.greeting.hide();
        this.button.hide();
        this.input.hide();
        this.title.hide();
        this.reset.hide();
    }
    show(){
        this.reset.show(); 
    }
    display() {
        this.title.html("SAVE WATER GAME");
        this.title.position(50, 50);
        this.title.style('font-size', '55px');
        this.title.style('color', 'yellow');
        this.input.position(200,400);
        this.input.style('width', '220px');
        this.input.style('height', '20px');
        this.input.style('background', 'skyblue');
        this.button.position(260,450);
        this.button.style('width', '100px');
        this.button.style('height', '40px');
        this.button.style('background', 'skyblue');
        this.reset.position(260,550);
        this.reset.style('width', '100px');
        this.reset.style('height', '40px');
        this.reset.style('background', 'skyblue');
        this.reset.hide();
        
        this.button.mousePressed(() => {
            this.input.hide();
            this.button.hide();
            this.reset.hide();
            player.name = this.input.value();
            playerCount += 1;
            //console.log(playerCount);
            player.index = playerCount;
            player.update(player.index);
            player.updateCount(playerCount);
            this.greeting.html("Hello " + player.name)
            this.greeting.position(150,250);
            this.greeting.style('color', 'white');
            this.greeting.style('font-size', '50px');
        });
        
        this.reset.mousePressed(() => {
            player.updateCount(0);
            game.update(0);
            player.resetUpdate(player.index)
            game.start()
        });
        
    }
}