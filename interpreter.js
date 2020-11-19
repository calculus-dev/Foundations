/**========================================================================
 *                           INTERPRETER.js
 * 
 * an extremely improved interpreter for the Foundations programming language
 *========================================================================**/

let variables = []

const fs = require('fs')
const file = fs.readFileSync('main.fps').toString()

const runFile = inputFile => {
    // Split the file into manageable chunks
    inputFile = inputFile.replace(/\r/g, '').split('\n')

    // For each line of code...
    for (i = 0; i < inputFile.length; i++) {
        // ...check for vars...
        if (inputFile[i].startsWith("let")) {
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
                    variables.push(
                        [
                            tempFile[0], 
                            tempFile[1]
                        ]
                    )
                }

                // ...and the value is not a string...
                else {
                    // find the variable mentioned
                    const found = variables.find(([x]) => x === tempFile[1]);
                    // push
                    if (found) variables.push(
                        [
                            tempFile[0],
                            found[1]
                        ]
                    )
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
        }



        // ...replace variables...
        for (x = 0; x < variables.length; x++) {
            if (inputFile[i].includes(variables[x]).toString) {
                inputFile[i] = inputFile[i].replace(
                    variables[x][0],
                    variables[x][1]
                )
            }
        }



        // ...check for print statements...
        const print = inputFile[i].match(/^println\(([^)]+)\)$/);
        if (print) {
            console.log(print[1].match(/^"([^"]+)"$/)?.[1] || variables.find(([x]) => x === print[1]))
        }
    }
}

runFile(file)
