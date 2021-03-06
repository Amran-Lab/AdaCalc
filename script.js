"use strict";


const max_digits = 8;
const _device_expression = document.getElementById("expression");
const _device_operand = document.getElementById("operand");
var AnsFlag = false


const screen = {
	//arrow functions have been used to define this object's internal methods
	set: {
		expression: (value) => { _device_expression.innerText = value; },
		operand: (value) => { _device_operand.innerText = value; },
	},
	clear: {
		expression: () => { _device_expression.innerText = ""; },
		operand: () => { _device_operand.innerText = ""; },
		all: () => { 
			_device_expression.innerText = "";
			_device_operand.innerText = "";
		},
	},
	get: {
		expression: () => { return _device_expression.innerText; },
		operand: () => { return _device_operand.innerText; },
	},
};


const calculation = {
	//use regular functions to define this object's intermal methods
	_expression: [],
	push: function (exp) {
    calculation._expression.push(exp);
    

   },
	pop: function () { 
    calculation._expression.pop();
    
  },
	last: function () {
 

    if (calculation._expression.length == 0){   //checks if anything is in array
      var quote = '';
      return quote;

    }
        //if not empty get last value
    return calculation._expression[calculation._expression.length - 1];
    },
	clear: function () {
    calculation._expression = [];  
    calculation._expression.length = 0; 
   },
	debug: function () { 
    console.log(calculation._expression)
  },

	expression: function() {
    //return calculation._expression.join(' '); //worked much easier
    var joinedExpression = "";
    var space = true;
    for (var i = 0; i < calculation._expression.length; i++) {
      joinedExpression =  append_value(joinedExpression,calculation._expression[i],"",space);
    }
    return joinedExpression;
  }
};


function append_value(original, append, glue, spacer=false) {
  var space = "";
  if (spacer == true){
    var space = " ";
  }
  if (original == ""){
    return append;

  }
  else if (append == ""){
    return original;

  }
  else if (glue == ""){
    return original + space + append;

  }
  else {
    return original + space + glue + space + append;
  }
    
}


function valid_leadingzeros(value) {

  if ((value[0] == '0') && (value[1] == '0')){

    return false;
  }
  else {

    return true;
  }
}


function valid_decimals(value) {
  var count = value.split('.').length - 1;  //splits the string into an array by .
  if (count > 1) {                  //number of . = number of elements in array -1
                                //e.g '123.234' = ['123','234] 1 dot = 2 array elements
    return false;            // '24222342' = ['2422342'] 0 dot = 1 array elements
  }
  else {
    return true;
  }
}


function trim_invalid_numerics(value) {
  var numeric = "";
  var isNumeric= ['0','1','2','3','4','5','6','7','8','9','.','-'];

  for (var i = 0; i < value.length; i++) {   
    if (isNumeric.includes(value[i])) {   //checks if each digit is numeric or . -
      numeric = numeric + value[i];   
    }
  
  }
  
  return numeric 
}


function control_pressed(control) {
	switch(control) {
		case "c":
    screen.clear.operand()
    console.log("c");
    if (AnsFlag == true){
      //if coming from an '=' giving the all clear
      screen.clear.all()
      calculation.clear();
      AnsFlag=false
      return
    }
    break
		case "ac": 
    screen.clear.all()
    calculation.clear();
    console.log("ac");
    break
		case "=":
    console.log("=");
    var total = screen.get.operand();
    if (AnsFlag == true){ //no changes made nothing to change
      return
    }
    //checks for invalid characters and empty expression
    if ((calculation.expression()=='') || (trim_invalid_numerics(total) != total)){
      screen.set.operand(total)
      return
    }
    
     
    var oper = ['+','-','/','*']
    if ((oper.includes(calculation.last())) && (total == '')){
      console.log("already pressed an operator Enter A Number")
      //alert("already pressed an operator Enter A Number")
      return
    }
    if (total == '.'){
      console.log("Pressed a Decimal Enter A Number")
      //alert("Pressed A Decimal Enter A Number")
      return
    }
    calculation.push(total)
    var express = calculation.expression();

    
    screen.set.expression(express)
    var val = evaluate(express)
    // checks for ERROR
    if (val =="ERROR"){
      calculation.clear()
      screen.set.operand(val)
      AnsFlag = true
      return
    }
    val = parseFloat(val)
    var valPrecision =  trailing_zero(val.toPrecision(max_digits));  //gets first 8 digits and removes end 0's at start

    calculation.clear()
    // Lets Digit Pressed And Operator Pressed Know We Have Recentlt finished an equation
    // And there is an answer 
    AnsFlag = true
    calculation.push(val)  // I want to push the value that is most accurate
    screen.set.operand(valPrecision)

    break
	}
}


function digit_pressed(digit) {
	console.log("digit pressed: " + digit);
  if (AnsFlag == true){ // check  if came from '='
    screen.clear.all()  // if so giving the all clear
    calculation.clear()
    AnsFlag = false      // resetting flag
  }
  var total = screen.get.operand();
  var numt = total.replace('.','');
  
  if (numt.length == max_digits){    //don't let user go past max digits
    return
  }
  total = total + digit
  if ((valid_decimals(total)==false) && (digit == '.')){
    return            // checks for multiple decimals

  }
  //checks for 0 at the beginning dpress 0 , 1 gives 1 dpress 0, ., 1, gives 0.1
  if ((valid_leadingzeros('0' + total)==false) && (total[1] != '.') && total.length > 1){
    screen.set.operand(total.slice(1,total.length))
    return

  }
  screen.set.operand(total);
}

function operator_pressed(operator) {
	console.log("operator pressed: " + operator);
  
  var total = screen.get.operand();
  // checks if we are preceding from an '='
  if (AnsFlag == true){
    AnsFlag = false   //if we are we can follow from calc.last()
    if (total=='ERROR'){
      screen.clear.all()
      return
    }
    total = ''
  }
  var oper = ['+','-','/','*']
  //checks if last expression was an operator
  if (oper.includes(calculation.last()) && total ==''){
    console.log("already pressed an operator")
    calculation.pop()
  }
  if (total!=''){
    calculation.push(total)
  }
  // So we can't Start With +/* but can start with -
  if ((calculation.last()=='') && (operator !='-')){
    console.log('No Number Yet Pressed')
    return
  }
  
  calculation.push(operator)
  var express = calculation.expression()
  screen.set.expression(express)
  screen.clear.operand()
}
//gets rid of 0s at end
function trailing_zero(exp){
  var str = exp.toString()
  //checks if last digit is 0
  while ((str[str.length -1] == '0' && str.includes('.')) || (str.includes('e'))){
    // as is 5.0000000e+10 => 5.00000000e+1 BAD ERRoR Handle
    if (str.includes('e')){
      var indexe = str.indexOf('e');
      while (str[indexe -1] == '0' && str.includes('.')){
        str = str.slice(0,indexe - 1) + str.slice(indexe,str.length)
        var indexe = str.indexOf('e');
      }
      var indexe = str.indexOf('e');

      if (str[indexe -1]=='.'){
        str = str.slice(0,indexe - 1) + str.slice(indexe,str.length)
    
      }

      break; // if this loop gets started we don't need the main
    }
    str = str.slice(0,str.length - 1)
    
  }
  if (str[str.length -1]=='.'){
    str = str.slice(0,str.length - 1)

  }
  return str
  
}


function evaluate(expression) {
  console.log('computing')
  expression = expression.toString()
  var expression = expression.replace(/\s/g, '');
  
  if (expression == ''){
    return ""
  }

  /* Was Checking for Invalid Characters try statement does that now though
  if (expression.replace((/[e+*\/]/g),"") != trim_invalid_numerics(expression)){

    return "ERROR"
  } Conflicted with e+ and NaN or Infinity maybe could've been accounted for
  */


  // gets rid of leading zero
  // looks behind for a number or decimal and looks ahead for a number
  // if there are numbers behind it or a decimal it matches
  // until it sees a number 00101.002100 return 101.002100 hopefully
  expression= expression.replace(/(?<![\.0-9])0+(?=[0-9])/g,'')
  console.log('expression')
  console.log(expression)



  var arr = []
  try {
    
    // .toFixed vs .toPrecision
    // x.toFixed(8) x.toPrecision(8)---------
    // x = 123456789.12345678123
    // 123456789.12345678 vs 12345678
    // x = 0.000012345678
    // 0.00001234 vs 0.000012345678----------
    // toFixed Has more accuracy with large numbers
    // opposed to small with toPrecision**GOOGLE CALC seems to use 12 sf
    var answer = eval(expression).toPrecision(12);
    answer = trailing_zero(answer); // Gets Rid of 0
    console.log(answer)
    answer = parseFloat(answer);  
    return answer;
  }
  catch(err) {
    return "ERROR"
  }


}

//search for all HTML objects that are using the class name 'button'
var buttons = document.getElementsByClassName('button');
for(let i = 0; i < buttons.length; i++) { //loop through each 'button' instance
	buttons[i].addEventListener('click', function() { //attach a 'click' event listener
    	switch(this.dataset.action) { //invoke a specific function based on the type of button 'clicked'
			//pass the ID to the selected function
			case("digit"): digit_pressed(this.id); break; 
			case("operator"): operator_pressed(this.id); break;
			case("control"): control_pressed(this.id); break;
		}
	})
}

//once the oload event has fired, execute any requested functions
window.onload = () => {
  screen.clear.all();

};