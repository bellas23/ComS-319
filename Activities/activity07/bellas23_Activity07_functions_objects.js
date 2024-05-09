// Author: Bella Singh
// ISU Netid : bellas23@iastate.edu
// Date : February 14th, 2024

//EXERCISE 1
function maxOfTwo(n1, n2) {
    if (n1 > n2) {
        return n1;
    } else {
        return n2;
    }
}
let n1 = 11;
let n2 = 10;
console.log(`The max between ${n1} and ${n2} is :`, maxOfTwo(n1, n2));


//EXERCISE 2
function maxOfArray(array) {
    let maxNumber = array[0];
    for (let i in array) {
        if (array[i] > maxNumber) {
            maxNumber = array[i];
        }
    }
    return maxNumber;
}
let array = [10, 11, 1024, 125, 9, 201];
console.log(maxOfArray(array));


//EXERCISE 3
function showProperties(movie) {
    console.log("List of Keys:");
    for (let key in movie) {
        console.log(key);
    }
    console.log("List of Values:");
    for (let key in movie) {
        console.log(movie[key]);
    }
    //can also just do:
    // console.log(Object.keys(movie));
    // console.log(Object.values(movie));
}
// Object:
const movie = {
    title: 'Some movie',
    releaseYear: 2018,
    rating: 4.5,
    director: 'Steven Spielberg'
};
showProperties(movie);

//EXERCISE 4
const circle = {
    radius: 2,
    area: function () {
        return (Math.PI * this.radius * this.radius)
    }
};
console.log(circle.area());

//EXERCISE 5
const circle2 = {
    radius: 2,
    area: function () {
        return (Math.PI * this.radius * this.radius)
    },
    get radiusValue() {
        return this.radius;
    },
    set radiusValue(value) {
        this.radius = value;
    }
};
console.log(`Area with ${circle2.radiusValue} :`, circle2.area());
circle2.radiusValue = 3;
console.log(`Area with ${circle2.radiusValue} :`, circle2.area());

//EXERCISE 6
const circle3 = {
    radius: 2,
    area: function () {
        return (Math.PI * this.radius * this.radius)
    },
    getRadiusValue: function () {
        return this.radius;
    },
    setRadiusValue(value) {
        this.radius = value;
    }
}
console.log(`Area with ${circle3.getRadiusValue()} :`, circle3.area());
circle3.setRadiusValue(3);
console.log(`Area with ${circle3.getRadiusValue()} :`, circle3.area());


//EXERCISE 7
function calculateAverageGrade(grades) {
    let total = 0;
    let count = 0;
    for (let subject in grades) {
        total += grades[subject];
        count++;
    }
    if (count === 0) {
        return 0;
    }
    return total / count;
}
const grades = {
    math: 85,
    science: 90,
    history: 75,
    literature: 88
};
console.log(calculateAverageGrade(grades));


//EXERCISE 8 - unfinished
function calculateAverageGrade(studentGrades) {
    let total = 0;
    let count = 0;
    for (let subject in studentGrades) {
        total += studentGrades[subject];
        count++;
    }
    if (count === 0) {
        return 0;
    }
    return Math.round(total / count);
}
const students = [
    {
        Fer: {
            math: 85,
            science: 90,
            history: 75,
            literature: 88
        }
    },
    {
        Alex: {
            math: 99,
            science: 97,
            history: 94,
            literature: 90
        }
    },
    {
        Mary: {
            math: 79,
            science: 72,
            history: 81,
            literature: 79
        }
    }
];
console.log(calculateAverageGrade(studentGrades));

//output should be
// console.log(averageGrades);
// {Fer: 85, Alex: 95, Mary: 78}