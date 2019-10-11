const {hasOwnProperty} = Object.prototype;

const objectPrototype = Object.prototype;

function isFlatObject(obj) {
    const {constructor} = obj;
    const prototype = Object.getPrototypeOf(obj);
    return (!constructor || constructor === Object) && (!prototype || prototype === objectPrototype);
}

const {isArray} = Array;

export default function isEqualObjects(obj, targetObj) {

    const isEqual = (value, targetValue, stack) => {
        if (value === targetValue) {
            return true;
        }

        if (value !== value && targetValue !== targetValue){
            return true;
        }

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
            } else if (isFlatObject(value) && isFlatObject(targetValue) && stack.indexOf(value)===-1) {

                const keys = Object.keys(value);
                const targetKeys = Object.keys(targetValue);
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


