// Get all the buttons and assign the click function to call our calculator with the buttons value
const clear = document.getElementById("clear-button")
const keys = document.getElementsByTagName("button")
for (const key of keys) {
    key.onclick = function() {Calculator(key.dataset.op)};
}

// Global variables that are used in the code
var lastKey = "";
var prevAction = "";
var lastOp = "";
var stackNum = 0;

// Our calculator function that does all the math
function Calculator(op) {
    // Get our calculator display
    var display = document.querySelector('div.calc-display')

    // Check what was sent to the calculator - number or operation
    if (isNaN(parseInt(op))) {
        // If it is an operation:
        switch (op) {
            // If there is no decimal point on the display - add it
            case '.':
                if  (isNaN(parseInt(lastKey)) && lastKey != "."){
                    display.textContent = 0;
                }
                if (display.textContent.lastIndexOf('.') == -1) {
                    display.textContent = display.textContent + op
                }
                clear.textContent = "C";
                break;
            // If 'AC' or 'C' is pressed - reset all variables
            case 'c':
                clear.textContent = "AC";
                zeroAll();
                break;
            
            // Else - run calculations with the given operations
            default:
                clear.textContent = "C";
                continuosCalc(op)
                break;
        }

    }
    else
    {
        // if the previous key pressed was an operation (and not '.') - put the number pressed on the display, else - add the number to the display
        if (display.textContent === '0' || (isNaN(parseInt(lastKey)) && lastKey !==".")) {
            display.textContent = op
        } 
        else {
            display.textContent = display.textContent + op
        }
    }

    // Save the last used key
    lastKey = op;

    // Calculates the result of 2 numbers (first,second) with the operation needed
    function calc(first,op,second){
        let tempNum = first;

        // Check that the given operation is not empty and do calculations
        if(op != ""){
            switch (op) {
            case "+":
                tempNum = first + second;
                break;
            case "-":
                tempNum = first - second;
                break;
            case "*":
                tempNum = first * second;
                break;
            case "/":
                tempNum = first / second;
                break;
            }

            // Set the last operation to be the currently used op
            lastOp = op;
        }

        return tempNum;
    }

    // Here all the magic happens - all the valid operations go here for calculation (+,-,x,÷,=)
    function continuosCalc(act) {
        // Save aside the currently displayed number
        let tempNum = parseFloat(display.textContent);

        // If this is the first action ever - just save in the stack the currently displayed number
        if (prevAction == "") {
            stackNum = tempNum;
        }
        else{
            // Check what was the previous action and act by it
            switch (prevAction) {
                case "=":
                    // If the current action is not equals -> just save the number in the stack (rewind the results of the '=')
                    if (act != "=") {
                        stackNum = tempNum;
                    }
                    else{
                        // If '=' was pressed multiple times - recalculate the displayed value with the same op and number
                        display.textContent = calc(parseFloat(display.textContent), lastOp, stackNum);
                    }
                    break;
            
                default:
                    // Calculate the values with the given operation and push the value into the the stack
                    display.textContent = calc(stackNum, prevAction, parseFloat(display.textContent))
                    stackNum = parseFloat(display.textContent);

                    // If the current action is '=' then we need to store the number that was on the display before the change
                    if (act == "=") {
                        stackNum = tempNum;
                    }
                    break;
            }
        }

        // Set previous action to be the current operation
        prevAction = act;
    }

    // Set default values for all the global variables
    function zeroAll()
    {
        lastOp = "";
        lastKey = "";
        prevAction = "";
        stackNum = 0;
        display.textContent = 0
    }
}