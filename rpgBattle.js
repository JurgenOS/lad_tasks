const readlineSync = require('readline-sync');

const monster = {
    maxHealth: 50,
    name: "Лютый",
    moves: [
        {
            "name": "Удар когтистой лапой",
            "physicalDmg": 3, // физический урон
            "magicDmg": 0,    // магический урон
            "physicArmorPercents": 20, // физическая броня
            "magicArmorPercents": 20,  // магическая броня
            "cooldown": 0     // ходов на восстановление
        },
        {
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 50,
            "magicArmorPercents": 0,
            "cooldown": 2
        },
    ]
};

const moves = [
    {
        "name": "Удар боевым кадилом",
        "physicalDmg": 2,
        "magicDmg": 0,
        "physicArmorPercents": 0,
        "magicArmorPercents": 50,
        "cooldown": 0
    },
    {
        "name": "Вертушка левой пяткой",
        "physicalDmg": 4,
        "magicDmg": 0,
        "physicArmorPercents": 0,
        "magicArmorPercents": 0,
        "cooldown": 4
    },
    {
        "name": "Каноничный фаербол",
        "physicalDmg": 0,
        "magicDmg": 5,
        "physicArmorPercents": 0,
        "magicArmorPercents": 0,
        "cooldown": 3
    },
    {
        "name": "Магический блок",
        "physicalDmg": 0,
        "magicDmg": 0,
        "physicArmorPercents": 100,
        "magicArmorPercents": 100,
        "cooldown": 4
    },
];

const player = {
    moves: moves,
    cooldowns: []
}

let move_number = 1;

monster.cooldowns = [];
monster.health = monster.maxHealth;
player.health = +readlineSync.question('Ведите здоровье персонажа:');

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

refreshCooldowns = function () {
    for (let i = 0; i < monster.cooldowns.length; i++) {
        if (monster.cooldowns[i] > 0) {
            monster.cooldowns[i] = monster.cooldowns[i] - 1;
        }
    }

    for (let i = 0; i < player.cooldowns.length; i++) {
        if (player.cooldowns[i] > 0) {
            player.cooldowns[i] = player.cooldowns[i] - 1;
        }
    }
}

generateMonsterMove = function () {
    let move = randomInteger(0, 2);
    if (!monster.cooldowns[move]) {
        monster.cooldowns[move] = monster.moves[move].cooldown;
        return monster.moves[move];
    } else {
        return generateMonsterMove();
    }
}

while (player.health > 0 && monster.health > 0) {
    console.log('\nХод ' + move_number);
    console.log(monster.name + ' HP: ' + +monster.health.toFixed(2));
    console.log('Игрок HP: ' + +player.health.toFixed(2) + '\n');
    const monsterMove = generateMonsterMove();
    console.log(monster.name + ' применяет ' + monsterMove.name);
    console.log('Физ. урон: ' + monsterMove.physicalDmg + ' / Маг. урон: ' + monsterMove.magicDmg + ' / Физ. защита: ' + monsterMove.physicArmorPercents + ' / Маг. защита: ' + monsterMove.magicArmorPercents);
    console.log('\nВаши возможные варианты:');
    let availableMoves = [];
    let availableMovesCodes = [];
    for (let i = 0; i < player.moves.length; i++) {
        const move = player.moves[i];
        if (!player.cooldowns[i]) {
            availableMovesCodes.push(i);
            availableMoves.push(move.name + ': Физ. урон: ' + move.physicalDmg + ' / Маг. урон: ' + move.magicDmg + ' / Физ. защита: ' + move.physicArmorPercents + ' / Маг. защита: ' + move.magicArmorPercents + ' / Задержка: ' + move.cooldown);
        }
    }
    const playerMoveCode = +readlineSync.keyInSelect(availableMoves, 'Ведите номер варианта:');

    if (playerMoveCode == -1) {
        console.log('Вы пропустили ход');
        player.health -= monsterMove.physicalDmg + monsterMove.magicDmg;
    } else {
        const playerMove = player.moves[availableMovesCodes[playerMoveCode]];
        player.cooldowns[availableMovesCodes[playerMoveCode]] = playerMove.cooldown;
        player.health -= (monsterMove.physicalDmg * ((100 - playerMove.physicArmorPercents) / 100)) + (monsterMove.magicDmg * ((100 - playerMove.magicArmorPercents) / 100));
        monster.health -= (playerMove.physicalDmg * ((100 - monsterMove.physicArmorPercents) / 100)) + (playerMove.magicDmg * ((100 - monsterMove.magicArmorPercents) / 100));
    }

    if (player.health <= 0) {
        console.log('Вы проиграли!');
    } else if (monster.health <= 0) {
        console.log('Вы выиграли!');
    }
    refreshCooldowns();
    move_number++;
}
