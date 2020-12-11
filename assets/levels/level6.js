var level_6 = {
    player: {
        x: 800,
        y: 450,
        discsLeft: 6
    },
    walls: [
        new Wall(300,200,250,50, 0),
        new Wall(450,100,50,250, 0),

        new Wall(300,700,250,50, 0),
        new Wall(450,800,50,250, 0),

        new Wall(1300,700,250,50, 0),
        new Wall(1150,800,50,250, 0),

        new Wall(1300,200,250,50, 0),
        new Wall(1150,100,50,250, 0)
    ],
    enemies: [
        new Enemy(1300,100,75,75, 0),
        new Enemy(1300,800,75,75, 0),
        new Enemy(300,100,75,75, 0),
        new Enemy(300,800,75,75, 0),
    ]
};