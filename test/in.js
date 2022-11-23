function log(stuff){
	console.log("I'm not an instance method");
}

Sussy.prototype.sayHi = function(){
	console.log("I'm not an instance method");
}

function Amogus(name){
	this.name = name;
}

Amogus.prototype.sayHi = function() {
	console.log("Hi I'm " + this.name);
}
