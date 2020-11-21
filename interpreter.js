/**========================================================================
 *                           INTERPRETER.js
 * 
 * an interpreter for the Foundations programming language
 *========================================================================**/

const fs = require('fs')
const file = fs.readFileSync('main.fps').toString()
let isInObject = null;

const runFile = (inputFile, parameters) => {
    const variables = {}
    const constants = {}
    const functions = {}
    // Split the file into manageable chunks
    inputFile = inputFile.replace(/\r/g, '').split('\n')

    // For each line of code...
    for (i = 0; i < inputFile.length; i++) {
        if (!!isInObject) {
            if (inputFile[i].includes("}")) {
                isInObject = null;
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

            for (var x in functions) {
                if (x === isInObject) {
                    functions[x].execute.push(inputFile[i]);
                }
            }
        } else {
        // ...check for vars...
            if (inputFile[i].startsWith("#")) {
                continue;
            } else if (inputFile[i].startsWith("let")) {
                let tempFile = inputFile[i].split(" = ")
                tempFile[0] = tempFile[0].replace(
                    "let ", 
                    ""
                )
                
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
                    console.log(errMsg)
                    return errMsg
                }
            } else if (inputFile[i].startsWith("final")) {
                let tempFile = inputFile[i].split(" = ")
                tempFile[0] = tempFile[0].replace(
                    "final ", 
                    ""
                )
                
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
            } else if(inputFile[i].startsWith("method")) {
                let tempFile = inputFile[i].split(/\(([^)]+)\)/);
                tempFile[0] = tempFile[0].replace(
                    "method ", 
                    ""
                )
                isInObject = tempFile[0];

                if (!tempFile[0].includes(" ")) {
                    if (tempFile[1].includes(",")) {
                        if (!tempFile[1].includes(" ")) {
                            // errMsg is standard for an error message
                            errMsg = `Error: Parsing parameter(s) on line ${i + 1}\n  Spaces are encouraged.`

                            // Both end the function and print out the error message
                            console.error(errMsg)
                            return errMsg
                        }
                    }
                    tempFile[1] = tempFile[1].split(", ");
                    functions[tempFile[0]] = {
                        parameters: {},
                        execute: []
                    }
                    for (var x in tempFile[1]) {
                        if (tempFile[1][x].length > 0) {
                            if (tempFile[1][x].includes("=")) {
                                tempFile[1][x] = tempFile[1][x].split(" = ");
                                functions[tempFile[0]].parameters[tempFile[1][x][0]] = tempFile[1][x][1];
                            } else {
                                functions[tempFile[0]].parameters[tempFile[1][x]] = undefined;
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
            } else {
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
                }
            }

            for (var x in functions) {
                if (inputFile[i].startsWith(x)) {
                    let tempFile = inputFile[i].split(/\(([^)]+)\)/);
                    tempFile[1] = tempFile[1].split(", ");
                    for (var y = 0, z = Object.entries(functions[x].parameters); y < z.length; y++) {
                        functions[x].parameters[z[y][0]] = tempFile[1][y];
                    }
                    //runFile(functions[x].execute.join("\n"));
                    //console.log(functions[x])
                }
            }

            /*

            If you're calling a function or whatever, here's the code:

            runFile(functions[x].execute.join("\n"));

            */



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
    }
    for (var x in functions) {
        for (var y in functions[x].execute) {
            functions[x].execute[y] = functions[x].execute[y].replace("    ", "")
        }
        runFile(functions[x].execute.join("\n"), functions[x].parameters);
    }
}

runFile(file)
