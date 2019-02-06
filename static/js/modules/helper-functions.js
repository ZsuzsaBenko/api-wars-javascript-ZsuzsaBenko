
export function addCommas(numString){
    let digits = Array.from(numString);
    for (let i = digits.length; i >= 0; i = i-3){
        digits.splice(i, 0, ",");
    }
    let newNumString = digits.join("");
    if (newNumString.startsWith(",") && newNumString.endsWith(",")){
        return newNumString.slice(1, -1);
    }
    else {
        return newNumString.slice(0, -1);
    }
}
