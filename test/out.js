function log(stuff){
	console.log("I'm not an instance method");
}

Sussy.prototype.sayHi = function(){
	console.log("I'm not an instance method");
}

class Amogus {
	constructor(name){
		this.name = name;
	}
	
	sayHi(){
		console.log("Hi I'm " + this.name);
	}
	
}