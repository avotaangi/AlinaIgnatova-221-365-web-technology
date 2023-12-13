function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

function isDigit(str) {
    return /^\d{1}$/.test(str);
}

function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) 
                    && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

function performOperation(a, b, operator) {
    switch (operator) {
    case '+':
        return a + b;
    case '-':
        return a - b;
    case '*':
        return a * b;
    case '/':
        if (b === 0) {
            throw new Error('Division by zero');
        }
        return a / b;
    default:
        throw new Error('Invalid operator');
    }
}

function evaluate(str) {
    let arr = [];
    let znach = str.split(' ');
    
    for (symbol of znach) {
        if (isNumeric(symbol)) {
            arr.push(parseFloat(symbol));
        } else if (isOperation(symbol)) {
            let oper2 = arr.pop();
            let oper1 = arr.pop();
            let result = performOperation(oper1, oper2, symbol);
            arr.push(result);
        }
    }
    return arr.pop();
}

function clickHandler(event) {
    const screen = document.querySelector('.screen');
    const target = event.target;

    if (target.classList.contains('digit')
        || target.classList.contains('operation')
        || target.classList.contains('bracket')) {
        screen.textContent += target.textContent;
    } else if (target.classList.contains('modifier')) {
        screen.textContent = '';
    } else if (target.classList.contains('result')) {
        try {
            const expression = screen.textContent;
            const result = evaluate(compile(expression));
            screen.textContent = result.toFixed(2);
        } catch (error) {
            screen.textContent = 'Error';
            console.error(error);
        }
    }
}

window.onload = function () {
    const calculator = document.querySelector('.calculate');
    calculator.addEventListener('click', clickHandler);
};
