// ========================================================================== //
// INTERPRETER.js                                                             //
// ========================================================================== //
//                                                                            //
// Several improvements have been made over ProXon (the rough draft of this   //
// language), the biggest being the leaving out of regexes.                   //
//                                                                            //
// ========================================================================== //

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

            if (tempFile[0].includes(" ") == false) {
                if (tempFile[1].includes("\"")) {
                    variables.push(
                        [
                            tempFile[0], 
                            tempFile[1]
                        ]
                    )
                }
                // This is where I leave off. Here is my roadblock:
                // What I want to do is replace the goodbye variable with
                // "Hi there!" (so I want to have one variable point to 
                // another variable). I am not sure how else to explain
                // this, so DM me if you need better explanation.
                // It is probably obvious, but I am sleepy.
                else {
                    for (x = 0; x < variables.length; x++) {
                        let index = variables[x].indexOf(tempFile[1].toString())
                        let thingToAppend = variables[x][index]

                        // variables.push(
                        //     [
                        //         tempFile[0],
                        //         thingToAppend.exit
                        //     ]
                        // )
                    }
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
