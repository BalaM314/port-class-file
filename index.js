#!/usr/bin/env node

import { Script } from "cli-app";
import * as fs from "fs";

const portClassFile = new Script(
	"port-class-file",
	"Automatically ports a JS file from the old \".prototype.\" class syntax to the new one.",
	async (opts, app) => {
		const target = opts.positionalArgs[0];
		if(!fs.existsSync(target)){
			console.error(`Path ${target} does not exist.`);
			return 1;
		}
		if(!fs.statSync(target).isFile()){
			console.error(`Path ${target} is not a file.`);
			return 1;
		}

		//Port it
		console.log(`Porting file ${target}...`);
		const data = fs.readFileSync(target, "utf-8");
		const portedData = getPortedData(data, {onlyUppercase: !("allFunctions" in opts.namedArgs)});
		fs.writeFileSync(opts.namedArgs.output, portedData, "utf-8");
		console.log(`Ported file ${target} to ${opts.namedArgs.output}.`);

	}, {
		positionalArgs: [{
			name: "target",
			description: "File to port",
			required: true
		}],
		namedArgs: {
			output: {
				description: "Output file name.",
				aliases: ["o"],
				required: true
			},
			allFunctions: {
				description: "Whether to treat all functions as classes instead of just ones with capitalized names.",
				needsValue: true,
				aliases: ["a"]
			}
		}
	}
);

const classStartRegex = /function (\w+)\((.*?)\) ?\{/;
const instanceMethodRegex = /(\w+)\.prototype\.(\w+) ?= ?function\((.*)\) ?\{/;
function getPortedData(data, {onlyUppercase}){
	const outputData = [];
	let shouldIndent = false;
	let className;
	for(const line of data.split(/\r?\n/)){
		if(line.match(classStartRegex)){
			const [, name, args] = line.match(classStartRegex);
			if(name[0] == name[0].toUpperCase() || !onlyUppercase){
				outputData.push(`class ${name} {`);
				outputData.push(`\tconstructor(${args}){`);
				className = name;
				shouldIndent = true;
				continue;
			}
		}
		if(line.match(instanceMethodRegex)){
			const [, _className, functionName, args] = line.match(instanceMethodRegex);
			if(_className == className){
				outputData.push(`\t${functionName}(${args}){`);
				continue;
			}
		}
		outputData.push(shouldIndent ? "\t" + line : line);
	}
	outputData.push("}");
	return outputData.join("\r\n");
}

portClassFile.run(process.argv);