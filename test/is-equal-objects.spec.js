const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const {isEqualObjects, cloneObject}= require("../src/is-equal-objects.js");
const prettyFormat= require('pretty-format');
const chai= require("chai");

chai.use(deepEqualInAnyOrder);

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
            [Object.create({
                [isEqualObjects.plainObject]: true,
                x: 123
            }), Object.create({
                [isEqualObjects.plainObject]: true,
                x: 123
            })]
        ],

        false: [
            [1, "1"],
            [complexObject1, complexObject2],
            [undefined, null],
            [undefined, ""],
            [[1], [1,2,3]],
            [{x:1}, {x:1, y:2}],
            [[1], [2]],
            [{x:1}, {x:2}],
            [{x:1}, {y:1}],
            [[1], {y:1}],
            [{x: {y:1}}, null]
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

    it('should work with circular references', function(){
        const obj1= {x:1};
        obj1.self= obj1;
        const result = isEqualObjects({x:1, self: obj1}, obj1);
        expect(result).to.be.true;
    })

    it('should support custom object comparator passed via fn context', ()=>{
        expect(isEqualObjects.call({
            comparator(obj1, obj2){
                return obj1.x === obj2.x;
            }
        }, {x: 123, ignoredProp: 456}, {x:123, ignoredProp: 987})).to.be.true;
    })
});

describe("cloneObjects", function () {
    it('should clone primitives values', ()=>{
        const source = {
            x: 1,
            y: "2"
        };

        expect(cloneObject(source)).to.deep.equalInAnyOrder({
            x: 1,
            y: "2"
        })
    });

    it('should clone complex nested values', ()=>{
        const source = {
            x: 1,
            y: {
                z: {
                    a: [new Date(123456), new RegExp(/\s+/), null]
                }
            }
        };

        const cloned = cloneObject(source);

        expect(cloned.y).to.not.equal(source.y);
        expect(cloned.y.z).to.not.equal(source.y.z);
        expect(cloned.y.z.a).to.not.equal(source.y.z.a);
        expect(cloned.y.z.a[0] === source.y.z.a[0]).to.be.false;
        expect(cloned.y.z.a[1] === source.y.z.a[1]).to.be.false;

        expect(cloned).to.deep.equalInAnyOrder({
            x: 1,
            y: {
                z: {
                    a: [new Date(123456), new RegExp(/\s+/), null]
                }
            }
        })
    });
});
