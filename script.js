"use strict";


const max_digits = 8;
const _device_expression = document.getElementById("expression");
const _device_operand = document.getElementById("operand");


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
    //console.log(calculation.last()); - output “”

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
    return calculation._expression.join(' ');
  }
};


function append_value(original, append, glue, spacer=false) {
  var space = "";
  if (spacer == true){
    var space = " ";
  }
  if (original == ""){
    console.log(append);
    return append;

  }
  else if (append == ""){
    console.log(original);
    return original;

  }
  else if (glue == ""){
    console.log(original + space + append);
    return original + space + append;

  }
  else {

    console.log(original + glue + append);
    return original + space + glue + space +append;
  }
    
}


function valid_leadingzeros(value) {

  if ((value[0] == '0') && (value[1] == '0')){
    console.log('false');
    return false;
  }
  else {
    console.log('true');
    return true;
  }
}

// uncertainty is '.' true or false is '.1' true or false
function valid_decimals(value) {
  var count = value.split('.').length - 1;  //splits the string into an array by .
  if (count > 1) {                  //number of . = number of elements in array -1
    console.log('false');   //e.g '123.234' = ['123','234] 1 dot = 2 array elements
    return false;            // '24222342' = ['2422342'] 0 dot = 1 array elements
  }
  else {
    console.log('true');
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
    break
		case "ac": 
    screen.clear.operand();
    screen.clear.expression();
    calculation.clear();
    console.log("ac");
    break
		case "=": 
    var total = screen.get.operand();
     
    var oper = ['+','-','/','*']
    if ((oper.includes(calculation.last())) && (total == '')){
      console.log("already pressed an operator")
      alert("already pressed an operator Enter A Number")
      return
    }
    calculation.push(total)
    var express = calculation.expression();
    screen.set.expression(express)
    var val = evaluate(express)
    console.log("=");

    screen.set.operand(val)
    calculation.clear()
    break
	}
}


function digit_pressed(digit) {
	console.log("digit pressed: " + digit);
  var total = screen.get.operand();
  var numt = total.replace('.','');
  
  if (numt.length == max_digits){
    return
  }
  total = total + digit
  if ((valid_decimals(total)==false) && (digit == '.')){
    return

  }

  total = leading_zero(total)
  screen.set.operand(total);
  

}


function operator_pressed(operator) {
	console.log("operator pressed: " + operator);
  //checks if last expression was an operator
  var oper = ['+','-','/','*']
  var total = screen.get.operand();
  if (oper.includes(calculation.last()) && total ==''){
    console.log("already pressed an operator")
    calculation.pop()
  }
  if (total!=''){
    calculation.push(total)
  }
  if ((calculation.last()=='') && (operator !='-')){
    console.log('No Number Yet Pressed')
    return
  }
  total = leading_zero(total)
  calculation.push(operator)
  var express = calculation.expression()
  screen.set.expression(express)
  screen.clear.operand()


}
function trailing_zero(exp){
  var str = exp.toString()
  //console.log(typeof(str))
  
  while (str[str.length -1] == '0'){
    str = str.slice(0,str.length - 1)
    
  }
  return str
  
}
function leading_zero(expression){
  
  while ((expression[0] == '0') && (expression[1] != '.') && (expression.length > 1)){
    expression= expression.slice(1,expression.length);
    
  }
  return expression;
  
}
function leading_zero_array(expression){
  
  var newarr = []
  for(let i = 0; i < expression.length; i++) {
    newarr.push(leading_zero(expression[i]))

  }
  return newarr

}
function evaluate(expression) {
  console.log('computing')
  var expression = expression.replace(/\s/g, '');
  //get rid of zero at every stage
  if (expression == ''){
    return ""
  }

  
  if (expression.replace((/[+*\/]/g),"") != trim_invalid_numerics(expression)){
    console.log(expression.replace((/[+*\/]/g),"") + " -- " + trim_invalid_numerics(expression))
    return "ERROR"
  }
  
  expression = expression.split('/')  
  expression = leading_zero_array(expression); 
  expression = expression.join('/')
  expression = expression.split('*')
  expression = leading_zero_array(expression); 
  expression = expression.join('*') 
  expression = expression.split('-')
  expression = leading_zero_array(expression); 
  expression = expression.join('-')
  expression = expression.split('+')
  expression = leading_zero_array(expression); 
  expression = expression.join('+')
  
  
  console.log('expression')
  console.log(expression);
  var arr = []
  // cant eval 005*02 need to get rid of zero
  var answer = eval(expression).toFixed(11);
  answer = trailing_zero(answer);
  //screen.set.operand(answer)
  console.log('answer');
  console.log(answer);
  
  ;
  var arr = expression.match(/[+*\/-]/g);
  answer = parseFloat(answer);
  if (arr == null){
    console.log('No Operator');

    return answer
  }

  
  return answer;

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

