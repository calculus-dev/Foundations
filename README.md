# Foundations
Foundations is a multi-paradigm programming language being developed by Calculus, gaetgu, and 1s3k3b.


Foundations aims to be a learning project and practice for a planned future language, Foundations Pro.
Foundations Pro will be to Foundations what C++ is to C. Foundations Pro will include more features, as well
as be faster. The end goal for both of the projects is to create a simple game. Once this is acheived,
the development on the project will likely be over, unless there is a significant community using the language.
In an attempt to keep the languages useful, they will have enough features for the game to be written in a
variety of different ways. This prevents creating game-specific events in the interpreter. If you would like
to contribute, file a Pull Request! More regular PR submitters *may* be invited to join the team if their work
is deemed useful by the team.


**Possible Syntax:**
```js
// comments

let a = "b";
let c = a;

// The final keyword is used to define constant variables. Constant variables cannot be changed/redefined.
final variable = "This is a final variable!";

method d(e, f) {
    println(e)
    return f
}

if (d(a, c) == "b") {
    for (x < 13; x++) {
        println(x)
    }
}

elif (d(a, c) == "c") {
    for (x > -12; x--) {
        print(x)
    }
} 

else {
    print("Sorry! #{a} was not good enough.")
}
```

