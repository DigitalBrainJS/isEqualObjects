const {hasOwnProperty} = Object.prototype;

const objectPrototype = Object.prototype;

const plainObjectSymbol = Symbol.for('isEqualObject:plainObject');

function isPlainObject(obj) {
    const {constructor} = obj;
    const prototype = Object.getPrototypeOf(obj);
    return obj[plainObjectSymbol] || (!constructor || constructor === Object) && (!prototype || prototype === objectPrototype);
}

const {isArray} = Array;

function isEqualObjects(obj, targetObj) {

    const {comparator, compareSymbols} = this || {};

    const isEqual = (value, targetValue, stack) => {
        if (value === targetValue) {
            return true;
        }

        if (value !== value && targetValue !== targetValue){
            return true;
        }

        let result;

        if (typeof value === "object" && typeof targetValue === "object" && value && targetValue) {
            if (isArray(value)) {
                if (isArray(targetValue)) {
                    const {length} = value;
                    if (length !== targetValue.length){
                        return false;
                    }
                    for (let i = 0; i < length; i++) {
                        if (!isEqual(value[i], targetValue[i], stack.concat([value]))){
                            return false;
                        }
                    }
                    return true;
                }
            } else if (value instanceof Date) {
                return targetValue instanceof Date && (+value === +targetValue);
            } else if (value instanceof RegExp) {
                return targetValue instanceof RegExp && value.toString() === targetValue.toString();
            } else if (comparator && (result = comparator(value, targetValue)) !== undefined) {
                return result;
            } else if (isPlainObject(value) && isPlainObject(targetValue) && stack.indexOf(value)===-1) {

                const keys = compareSymbols ? getAllProps(value) : Object.keys(value);
                const targetKeys = compareSymbols ? getAllProps(targetValue) : Object.keys(targetValue);
                const {length} = keys;
                if (length !== targetKeys.length){
                    return false;
                }
                for (let i = 0; i < length; i++) {
                    const key = keys[i];
                    if (!hasOwnProperty.call(targetValue, key)){
                        return false;
                    }
                    const propValue = value[key];
                    const targetPropValue = targetValue[key];
                    if (!isEqual(propValue, targetPropValue, stack.concat([value]))) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    };
    const {length} = arguments;
    for (let i = 1; i < length; i++) {
        if (!isEqual(obj, arguments[i], [])) {
            return false;
        }
    }
    return true;
}

Object.defineProperties(isEqualObjects, {
    plainObject: {value: plainObjectSymbol}
})


const cloneMap= new Map([
  [RegExp, target => new RegExp(target.source, target.flags)],
  [Date, target => new Date(+target)]
]);

const getAllProps= (obj)=> Object.keys(obj).concat(Object.getOwnPropertySymbols(obj));

function cloneObject(obj) {
    const cloneTarget = (target, stack) => {
        if (typeof target !== 'object') {
            return target;
        }

        if (target === null) return null;

        if (isArray(target)) {
            const len = target.length;
            const cloned = new Array(len);
            let targetStack = len && (stack ? stack.concat(target) : [target]);
            for (let i = 0; i < len; i++) {
                cloned[i] = cloneTarget(
                  target[i],
                  targetStack
                );
            }
            return cloned;
        }

        const {constructor} = target;
        const cloner = constructor && cloneMap.get(constructor);
        if (cloner) {
            return cloner(target, stack);
        }

        if (isPlainObject(target) && (!stack || stack.indexOf(target) === -1)) {
            const proto = Object.getPrototypeOf(target);
            const cloned = proto === objectPrototype ? {} : Object.create(objectPrototype);
            const props = getAllProps(target);
            let len = props.length;
            let prop;
            let targetStack = len && (stack ? stack.concat(target) : [target]);
            for(let i=0; i< len; i++){
                prop = props[i];
                cloned[prop] = cloneTarget(
                  target[prop],
                  targetStack
                );
            }
            return cloned;
        }

        return target;
    }

    return cloneTarget(obj, null);
}


module.exports= {
    isEqualObjects,
    cloneObject
}
