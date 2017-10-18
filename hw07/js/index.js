//------------------------------------------------------------------
// PART I
//------------------------------------------------------------------
//Create a function that appends an "li" element to an unordered list
// ("ul" element) in the DOM. This function should take a string as a
// parameter. In the body of the function, there should be code that
// appends an "li" element, with the string inside, to the un-ordered
// list ("ul" tag):


const addListItemToUnoderedHTMLList = (message) => {
          document.getElementById('output').innerHTML += "<li>" + message + "</li>"
              }



//------------------------------------------------------------------
// PART II
//------------------------------------------------------------------
// Using the strategy of your choice, write a loop over the numbers
// 1 - 100 that satisfies the following conditions:
//
// 1. If the number is divisible by 3, append "Fizz" to the unordered list
// 2. If the number is divisible by 5, append "Buzz" to the unordered list
// 3. If the number is divisible by 3 AND 5, append "FizzBuzz" to the unordered list.
// 4. Bonus points: Include both the number *and* the word you've appended to the list

let start = 0

 for (let i = 1; i < 101; i++) {
//        console.log(i)
//       addLIstItemToUnoderedHTMLList(i)
      if (i % 3 === 0 && i % 5 === 0) {
        addListItemToUnoderedHTMLList("FizzBuzz")
      }
      else if (i % 3 === 0) {
         addListItemToUnoderedHTMLList("fizz")
       }
        else if (i % 5 ===0 ) {
          addListItemToUnoderedHTMLList("Buzz")
        }
        else {
           addListItemToUnoderedHTMLList(i)
      }
 }
