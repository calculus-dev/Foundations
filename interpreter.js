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
    inputFile = inputFile.split("\n")

    // For each line of code...
    for (i = 0; i < inputFile.length; i++) {
        // ...check for vars...
        if (inputFile[i].includes("let")) {
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
                    // ...for each item in the variables array...
                    for (x = 0; x < variables.length; x++) {
                        var index = variables[x].indexOf(tempFile[1]) + 1
                        var thingToAppend = variables[x][index]
                    }
                    // push
                    variables.push(
                        [
                            tempFile[i],
                            thingToAppend
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
        if (inputFile[i].includes("println")) {
            // Initialize the tempFile var, removing the println()
            let tempFile = inputFile[i].replace(
                "println(\"", 
                ""
            )
            tempFile = tempFile.replace(
                "\")", 
                ""
            )

            // Print out whatever was inside the print
            console.log(tempFile)
        }
    }
}

runFile(file)
console.log(variables)
