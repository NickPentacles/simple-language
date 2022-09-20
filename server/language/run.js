import {parse} from './parser.js'
import {evaluate, specialForms} from './interpreter.js'

export const topScope = Object.create(null)
topScope.true = true
topScope.false = false

topScope.array = Function("...args", "return args")
topScope.length = Function("array", "return array.length")
topScope.element = Function("array, n", "return array[n]")


for (let op of ['+', '-', '*', '/', '==', '<', '>']) {
    topScope[op] = Function("a, b", `return a ${op} b;`)
}

export function run(program) {
    return evaluate(parse(program), Object.create(topScope))
}

