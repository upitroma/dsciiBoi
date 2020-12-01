var level_3 = {
    player: {
        x: 1000,
        y: 250,
        discsLeft: 6
    },
    walls: [
        new Wall(900,650,125,75, 0),
        new Wall(950,450,100,50, 0),
        new Wall(1200,300,150,75, 0),
        new Wall(1375,425,75,100, 0),
        new Wall(1300,500,75,75, 0),
        new Wall(1200,825,100,75, 0),
        new Wall(425,450,100,75, 0),
        new Wall(350,825,100,75, 0),
        new Wall(200,200,150,75, 0),
        new Wall(150,725,150,75, 0),
    ],
    enemies: [
        new Enemy(250,125,50,50,0),
        new Enemy(150,650,50,50,0),
        new Enemy(350,750,50,50,0),
        new Enemy(1200,750,50,50,0),
        new Enemy(1300,425,50,50, 0),
        new Enemy(900,575,50,50, 0),
    ]
};