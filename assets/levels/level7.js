var level_7 = {
    player: {
        x: 800,
        y: 450,
        discsLeft: 2
    },
    walls: [
        new Wall(800,150,150,100, 0),
        new Wall(400,300,100,150, 0),
        new Wall(1200,400,100,150, 0),

    ],
    enemies: [
        new Enemy(800,250,50,50, 0),
        new Enemy(500,300,50,50, 0),
        new Enemy(1100,400,50,50, 0),
    ]
};