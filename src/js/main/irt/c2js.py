import sys
import re

input = ''
for line in sys.stdin:
	line = line.strip()

	#don't process preprocessor directives and empty lines
	if not (len(line) == 0 or re.match('//', line) or re.match('#', line)):
		#remove comments
		line = re.sub('\s*//.*', '', line)
		input += line + '\n'

#repace with js equivalent function/value
input = re.sub('INFINITY', 'Infinity', input)
input = re.sub('M_PI', 'Math.PI', input)
input = re.sub(r'(\W)pow\s*\(', r'\1Math.pow(', input)
input = re.sub(r'(\W)exp\s*\(', r'\1Math.exp(', input)
input = re.sub(r'(\W)sqrt\s*\(', r'\1Math.sqrt(', input)
input = re.sub(r'(\W)fabs\s*\(', r'\1Math.abs(', input)
input = re.sub(r'(\W)log\s*\(', r'\1Math.log(', input)
input = re.sub(r'==', r'===', input)

lastEnd = 0
output = ''
scopes = list(re.finditer(r'{|}', input))
#process functions
for match in re.finditer(r'([;{}]|^)\s*(void|double)\s+(\w+)\s*\(([\w\s,*]*)\)', input):
	output += match.string[lastEnd:match.start()]
	argsJs = []
	pointers = []

	#transform function signature; pointers -> properties of return value
	for arg in re.finditer(r'\w+\s*([*]?)\s*(\w+)', match.group(4)):
		argsJs.append(arg.group(2))
		if arg.group(1):
			pointers.append(arg.group(2))

	if match.group(3) == 'estimate':
		estimateParams = argsJs

	#find function body boundaries
	scopeCounter = 0
	for m in [s for s in scopes if s.start() >= match.end()]:
		if m.group(0) == '{':
			scopeCounter += 1
		else:
			scopeCounter -= 1

		if scopeCounter == 0:
			break

	lastEnd = m.end()
	body = match.string[match.end(): m.start()]

	#replace variable declarations
	body = re.sub(r'\s*double\s+', r'var ', body)

	#replace pointers with variables
	body = re.sub(r'([^\w\s()]|^)\s*\*\s*(\w+)', r'\1 \2', body)
	if match.group(2) == 'void' and len(pointers):
		returnStatement = 'return {' + ','.join([p + ':' + p for p in pointers]) + '}'
		body = re.sub('return', returnStatement, body)
		body += returnStatement

	body += '};'

	output += 'var ' + match.group(3) + ' = function(' + ','.join(argsJs) + ')' + body

#input = re.sub(r'(var\s+\w+)\s*\(([\w\s,*]*)\)', startFunction, input)
#input = re.sub(r'([^\w\s()]|^)\s*\*\s*(\w+)', r'\1 \2', input)

print 'define([], function() {'
print 'var KidaptiveIrt = {};'
print '(function() {'

print output

print 'KidaptiveIrt.estimate = function(' + ','.join(estimateParams) + ') {'
print 'return estimate(' + ','.join([p + '||0' for p in estimateParams]) + ');'
print '};'
print '})();'
print 'return KidaptiveIrt'
print '});'