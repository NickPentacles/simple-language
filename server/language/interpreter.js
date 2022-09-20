export const specialForms = Object.create(null)

export function evaluate(expr, scope) {
    if (expr.type == "value") {
        return expr.value
    } else if (expr.type == "word") {
        if (expr.name in scope) {
            return scope[expr.name]
        } else {
            throw new ReferenceError(
                `Indefinite binding: ${expr.name}`
            )
        }
    } else if (expr.type == "apply") {
        let {operator, args} = expr
        if(operator.type == "word" && operator.name in specialForms) {
            return specialForms[operator.name](expr.args, scope)
        } else {
            let op = evaluate(operator, scope)
            if (typeof op == "function") {
                return op(...args.map(arg => evaluate(arg, scope)))
            } else {
                throw new TypeError("Application is not a feature.")
            }
        }
    }
}

specialForms.if = (args, scope) => {
    if(args.length != 3) {
        throw new SyntaxError("Invalid number of arguments for if.")
    } else if (evaluate(args[0], scope) !== false) {
        return evaluate(args[1], scope)
    } else {
        return evaluate(args[2], scope)
    }
}

specialForms.while = (args, scope) => {
    if (args.length != 2) {
        throw new SyntaxError("Invalid number of arguments for while.")
    }
    while (evaluate(args[0], scope) !== false) {
        evaluate(args[1], scope)
    }
    // Поскольку значения undefined в нашем языке не существует,
    // при отсутствии осмысленного результата возвращаем false.
    return false
}

specialForms.do = (args, scope) => {
    let value = false 
    for (let arg of args) {
        value = evaluate(arg, scope)
    }
    return value
}

specialForms.define = (args, scope) => {
    if (args.length != 2 || args[0].type != "word") {
        throw new SyntaxError("Incorrect use of definition.")
    }
    let value = evaluate(args[1], scope)
    scope[args[0].name] = value
    return value
}

specialForms.set = (args, scope) => {
    if (args.length != 2 || args[0].type != "word") {
        throw new SyntaxError("Incorrect use of definition.")
    }
    let scopex = upScope(args[0].name, scope)
    let value = evaluate(args[1], scopex)
    scopex[args[0].name] = value
    return value
}

function upScope(name, scope) {
    if (scope == null) throw new SyntaxError("Variable does not exist.")
    if (Object.prototype.hasOwnProperty.call(scope, name)) return scope
    return upScope(name, Object.getPrototypeOf(scope))
}

specialForms.fun = (args, scope) => {
    if (!args.length) {
        throw new SyntaxError("The function must have a body.")
    }
    let body = args[args.length - 1]
    let params = args.slice(0, args.length - 1).map(expr => {
        if (expr.type != 'word') {
            throw new SyntaxError("Parameter names must be string")
        }
        return expr.name
    })
    return function() {
        if (arguments.length != params.length) {
            throw new TypeError("Invalid number of arguments")
        }
        let localScope = Object.create(scope)
        for (let i = 0; i < arguments.length; i++) {
            localScope[params[i]] = arguments[i]
        }
        return evaluate(body, localScope)
    }
}
