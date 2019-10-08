const isEqualObjects= require("../dist/is-equal-objects.cjs");
const prettyFormat= require('pretty-format');
const chai= require("chai");

const {expect} = chai;

describe("isEqualObjects", function () {

    const complexObject1 = Object.create({});
    const complexObject2 = Object.create({});
    const plainObject = {};

    const asserts = {
        true: [
            [1, 1],
            ["1", "1"],
            [null, null],
            [true, true],
            [NaN, NaN],
            [/s/, /s/],
            [new Date('2014-02-01'), new Date('2014-02-01')],
            [plainObject, plainObject],
            [[], []],
            [[1,2,3], [1,2,3]],
            [{}, {}],
            [{x: 1}, {x: 1}],
            [{x: {}}, {x: {}}],
            [{x: {y: {}}}, {x: {y: {}}}],
            [{x: complexObject1}, {x: complexObject1}],
        ],

        false: [
            [1, "1"],
            [complexObject1, complexObject2],
            [undefined, null],
            [undefined, ""],
        ]
    };

    const dump= (obj)=> prettyFormat(obj, {min: true});

    asserts.true.forEach(([obj1, obj2]) => {
        it(`should return true for same objects (${dump(obj1)}, ${dump(obj2)})`, function () {
            const result = isEqualObjects(obj1, obj2);
            expect(result).to.be.true;
        });
    });

    asserts.false.forEach(([obj1, obj2]) => {
        it(`should return false for objects with differences (${dump(obj1)}, ${dump(obj2)})`, function () {
            const result = isEqualObjects(obj1, obj2);
            expect(result).to.be.false;
        });
    });
});
