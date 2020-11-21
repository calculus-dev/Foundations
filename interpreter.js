/**========================================================================
 *                           INTERPRETER.js
 * 
 * an interpreter for the Foundations programming language
 *========================================================================**/

const fs = require('fs')
const file = fs.readFileSync('main.fps').toString()

let isInObject = null;
let skipLine = null;
let objects = 0;

const keywords = [
    "new",
    "let",
    "if",
    "switch",
    "method",
    "final",
    "print"
]

const runFile = (inputFile, parameters) => {
    const variables = {}
    const constants = {}
    const methods = {}

    // Split the file into manageable chunks
    inputFile = inputFile.replace(/\r/g, '').split('\n')

    // For each line of code...
    for (i = 0; i < inputFile.length; i++) {
        inputFile[i] = inputFile[i].replace("    ", "")
        
        if (skipLine) {
            if (inputFile[i].includes("else")) {
                skipLine = null;
            } else {
                continue;
            }
        }
        
        if (!!isInObject) {
            if (inputFile[i].includes("}")) {
                if (objects === 0) {
                    isInObject = null;
                }

                if (!inputFile[i].includes("{")) {
                    objects--;
                }
            }

            for (var x in variables) {
                if (x === isInObject) {
                    console.log(variables[x]);
                }
            }

            for (var x in constants) {
                if (x === isInObject) {
                    console.log(constants[x]);
                }
            }

            for (var x in methods) {
                if (x === isInObject) {
                    methods[x].execute.push(inputFile[i]);
                }
            }

            continue;
        }
        
        // ...check for vars...
        if (inputFile[i].startsWith("#")) {
            continue;
        }
        else if (inputFile[i].startsWith("let")) {
            let tempFile = inputFile[i].split(" = ")
            tempFile[0] = tempFile[0].replace(
                "let ", 
                ""
            )

            for (var x in keywords) {
                if (tempFile[0] === keywords[x]) {
                    errMsg = `Error: Defining variable on line ${i + 1}\n  The keyword "${keywords[i]}" is reserved.`

                    console.error(errMsg)
                    return errMsg
                }
            }
            
            // as long as the variable declaration does not contain a space...
            if (tempFile[0].includes(" ") == false) {
                // ...and the value is a string...
                if (tempFile[1].includes("\"")) {
                    // ...then push the value and declaration to the array...
                    variables[tempFile[0]] = tempFile[1];
                }

                // ...and the value is not a string...
                else {
                    // find the variable mentioned
                    const found = Object.entries(variables).find(([x]) => x === tempFile[1]);
                    // push/save the variable
                    if (found) variables[tempFile[0]] = found[1];
                }
            }
            else {
                // errMsg is standard for an error message
                errMsg = `ERROR PARSING VARIABLE ON LINE ${i + 1} :=> 
                SPACES NOT ALLOWED IN VARIABLE DECLARATIONS`

                // Both end the function and print out the error message
                console.error(errMsg)
                return errMsg
            }
        }
        else if (inputFile[i].startsWith("final")) {
            let tempFile = inputFile[i].split(" = ")
            tempFile[0] = tempFile[0].replace(
                "final ", 
                ""
            )

            for (var x in keywords) {
                if (tempFile[0] === keywords[x]) {
                    errMsg = `Error: Defining variable on line ${i + 1}\n  The keyword "${keywords[i]}" is reserved.`

                    console.error(errMsg)
                    return errMsg
                }
            }
            
            // as long as the variable declaration does not contain a space...
            if (tempFile[0].includes(" ") == false) {
                // ...and the value is a string...
                if (tempFile[1].includes("\"")) {
                    // ...then push the value and declaration to the array...
                    constants[tempFile[0]] = tempFile[1];
                } else { // ...and the value is not a string...
                    // find the variable mentioned
                    const found = Object.entries(constants).find(([x]) => x === tempFile[1]);
                    // push/save the variable
                    if (found) constants[tempFile[0]] = found[1];
                }
            } else {
                // errMsg is standard for an error message
                errMsg = `ERROR PARSING VARIABLE ON LINE ${i + 1} :=> 
                SPACES NOT ALLOWED IN VARIABLE DECLARATIONS`

                // Both end the function and print out the error message
                console.error(errMsg)
                return errMsg
            }
        }
        else if (inputFile[i].startsWith("method")) {
            let tempFile = inputFile[i].split(/\(([^)]+)\)/);
            tempFile[0] = tempFile[0].replace(
                "method ",
                ""
            )

            for (var x in keywords) {
                if (tempFile[0] === keywords[x] || tempFile[1] === keywords[x]) {
                    errMsg = `Error: Defining variable on line ${i + 1}\n  The keyword "${keywords[i]}" is reserved.`

                    console.error(errMsg)
                    return errMsg
                }
            }

            isInObject = tempFile[0];
            objects++;

            if (!tempFile[0].includes(" ")) {
                if (tempFile[1].includes(",")) {
                    if (!tempFile[1].includes(" ")) {
                        errMsg = `Error: Parsing parameter(s) on line ${i + 1}\n  Spaces are encouraged.`

                        console.error(errMsg)
                        return errMsg
                    }
                }
                tempFile[1] = tempFile[1].split(", ");
                methods[tempFile[0]] = {
                    parameters: {},
                    execute: []
                }
                for (var x in tempFile[1]) {
                    if (tempFile[1][x].length > 0) {
                        if (tempFile[1][x].includes("=")) {
                            tempFile[1][x] = tempFile[1][x].split(" = ");
                            methods[tempFile[0]].parameters[tempFile[1][x][0]] = tempFile[1][x][1];
                        } else {
                            methods[tempFile[0]].parameters[tempFile[1][x]] = undefined;
                        }
                    }
                }
            } else {
                // errMsg is standard for an error message
                errMsg = `Error: Parsing variable(s) on line ${i + 1}\n    Spaces are not allowed in variable declarations.`

                // Both end the function and print out the error message
                console.error(errMsg)
                return errMsg
            }
        }
        else if (inputFile[i].startsWith("if")) {
            let tempFile = inputFile[i].split(/\(([^)]+)\)/);
            tempFile[0] = tempFile[0].replace(
                "if ",
                ""
            )

            let old = tempFile[1];

            for (var x in keywords) {
                if (tempFile[1] === keywords[x]) {
                    errMsg = `Error: Defining variable on line ${i + 1}\n  The keyword "${keywords[i]}" is reserved.`

                    console.error(errMsg)
                    return errMsg
                }
            }

            for (var x in variables) {
                if (tempFile[1] === x) {
                    tempFile[1].replace(x, variables[x]);
                }
            }

            for (var x in constants) {
                if (tempFile[1] === x) {
                    tempFile[1].replace(x, constants[x]);
                }
            }

            for (var x in methods) {
                if (tempFile[1] === x) {
                    tempFile[1].replace(x, methods[x]);
                }
            }

            if (!!parameters) {
                for (var x in parameters) {
                    if (tempFile[1] === x) {
                        tempFile[1] = tempFile[1].replace(x, parameters[x]);
                    }
                }
            }

            if (tempFile[1] === old) {
                switch (tempFile[1]) {
                    case "false":
                        skipLine = !0;
                        break;

                    case "true":
                        break;
                
                    default:
                        errMsg = `Error: The variable "${tempFile[1]}" on line ${i + 1}\n   is not defined.`
                        console.error(errMsg)
                        return errMsg
                }
            }

            objects++;
        }
        else {
            // If a variable is being redefined...
            if (inputFile[i].includes("=")) {
                let tempFile = inputFile[i].split(" = ")
                // ... Checking if said variable is a constant...
                for (var x in constants) {
                    if (tempFile[0] === x) {
                        // ...returning an error...
                        errMsg = `Error: Assignment to constant variable on line ${i + 1}`;

                        console.error(errMsg);
                        return errMsg
                    }
                }

                for (var x in variables) {
                    if (tempFile[0] === x) {
                        variables[x] = tempFile[1]
                    }
                }
            }
        }



        for (var x in methods) {
            if (inputFile[i].startsWith(x)) {
                let tempFile = inputFile[i].split(/\(([^)]+)\)/);
                tempFile[1] = tempFile[1].split(", ");
                for (var y = 0, z = Object.entries(methods[x].parameters); y < z.length; y++) {
                    methods[x].parameters[z[y][0]] = tempFile[1][y];
                }
            }
        }



        // ...replace variables...
        for (var x in variables) {
            if (inputFile[i].includes(x).toString) {
                if (!inputFile[i].startsWith("let ")) {
                    inputFile[i] = inputFile[i].replace(x, variables[x]);
                }
            }
        }



        for (var x in constants) {
            if (inputFile[i].includes(x)) {
                if (!inputFile[i].startsWith("final ")) {
                    inputFile[i] = inputFile[i].replace(x, constants[x]);
                }
            }
        }



        if (!!parameters) {
            for (var x in parameters) {
                if (inputFile[i].includes(x)) {
                    if (!!parameters[x]) {
                        if (inputFile[i].includes("(")) {
                            inputFile[i] = inputFile[i].split("(");
                            inputFile[i][1] = inputFile[i][1].replace(x, parameters[x]);
                            inputFile[i] = inputFile[i].join("(");
                        } else {
                            inputFile[i] = inputFile[i].replace(x, parameters[x]);
                        }
                    }
                }
            }
        }



        // ...check for print statements...
        const print = inputFile[i].match(/^print\(([^)]+)\)$/);
        if (print) {
            if (print[1].includes("\"")) {
                var concat = print[1].split(/"/);
                if (concat[2]) {
                    for (var x in concat) {
                        if (concat[x].includes("+")) {
                            delete concat[x];
                        }
                    }
                    print[1] = "\"" + concat.join("") + "\"";
                }
            }
            console.log(print[1].match(/^"([^"]+)"$/)?.[1] || Object.entries(variables).find(([x]) => x === print[1]))
        }
    }
    
    for (var x in methods) {
        for (var y in methods[x].execute) {
            methods[x].execute[y] = methods[x].execute[y]
        }
        runFile(methods[x].execute.join("\n"), methods[x].parameters);
    }
}

runFile(file)
