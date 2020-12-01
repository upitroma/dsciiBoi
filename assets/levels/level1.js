var level_1 = {
    player:  {
        x: 250,
        y: 400,
        discsLeft: 4
    },
    enemies: [
        new Enemy(1000,800,50,50,0),
        new Enemy(100,750,50,50,0),
        new Enemy(1500,250,50,50,0),
        new Enemy(1300,250,50,50,0)
    ],
    walls: [
        new Wall(700,700,300,100, 0),
        new Wall(1000,850,300,50, 0),
        new Wall(100,825,75,75, 0),
        new Wall(1000,300,400,200, 0),
        new Wall(1350,350,500,100, 0)
    ]
};