var level_8 = {
    player: {
        x: 800,
        y: 450,
        discsLeft: 2
    },
    walls: [
        new Wall(550,150,150,50, 0),
        new Wall(400,200,50,150, 0),

        new Wall(1150,750,150,50, 0),
        new Wall(1300,700,50,150, 0),

    ],
    enemies: [
        new Enemy(1150,850,50,50, 0),
        new Enemy(1400,700,50,50, 0),

        new Enemy(300,200,50,50, 0),
        new Enemy(550,50,50,50, 0),
    ]
};