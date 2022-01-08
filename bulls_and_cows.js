const readlineSync = require('readline-sync');

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

const numbersLength = randomInteger(3, 6);
let generatedNumber = '';

for (let i = 0; i < numbersLength;) {
    let digit = randomInteger(0, 9);
    while(true) {
        if(i ===0  && digit===0){
            continue
        }
        if (generatedNumber.indexOf(digit) === -1) {
            generatedNumber += digit;
            i++;
            break
        }
    }
}

console.log(generatedNumber);

let attemptNumber = +readlineSync.question('Ведите количество попыток:');

while (attemptNumber > 0) {
    const userNumber = readlineSync.question('Ведите число содержащее от 3 до 6 цифр:');
    orderedMatches = 0;
    orderedNumbers = '';
    unorderedMatches = 0;
    unorderedNumbers = '';

    for (let n of userNumber) {
        if (n === generatedNumber[userNumber.indexOf(n)]) {
            orderedNumbers += n;
            orderedMatches += 1;
        } else if (generatedNumber.includes(n)) {
            unorderedMatches += 1;
            unorderedNumbers += n;
        }
    }

    if (userNumber === generatedNumber) {
        console.log('Угадано!');
        attemptNumber = 0;
    }else{
        console.log(`ответ: совпавших цифр не на своих местах - ${unorderedMatches} (${unorderedNumbers.split('')}), цифр на своих местах - ${orderedMatches} (${orderedNumbers.split('')})`);
        attemptNumber -= 1;
    }
}
