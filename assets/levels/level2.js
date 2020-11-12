var level_2 = {
    player: {
        x: 700,
        y: 450
    },
    walls: [
        new Wall(375,575,100,75, 0),
        new Wall(700,750,300,75, 0),
        new Wall(300,750,125,75, 0),
        new Wall(1000,300,100,75, 0),
        new Wall(1100,375,100,75, 0),
        new Wall(100,550,100,50, 0),
        new Wall(200,475,75,75, 0),
        new Wall(1200,225,100,50, 0),
        new Wall(1200,550,100,75, 0),
        new Wall(1000,650,100,100, 0),
        new Wall(350,300,100,100, 0),
        new Wall(1400,700,100,75, 0),
    ],
    enemies: [
        new Enemy(100,485,50,50,0),
        new Enemy(300,675,50,50,0),
        new Enemy(1100,295,50,50,0),
        new Enemy(1400,625,50,50,0),
        new Enemy(250,300,50,50, 0),
    ]
}