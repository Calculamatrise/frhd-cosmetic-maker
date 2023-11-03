function manipulateCoords(input, callback = r => r) {
    const parts = input.split(/\s*(?=[A-Za-z])\s*/);
    for (const i in parts) {
        const part = parts[i];
        const combined = part.split(/\s+/);
        const identifier = combined.shift();
        if (combined.length < 1) continue;
        const points = combined.join(' ').split(/\s*,\s*/);
        for (const i in points) {
            const cartesian = points[i].split(/\s+/);
            points[i] = callback(...cartesian.map(i => parseFloat(i))).join(' ');
        }

        parts[i] = identifier + ' ' + points.join(', ');
    }

    return parts.join(' ')
}

function parseScript(script) {
	let gAttributes = new Map();
	let paths = [];
	let currentPath = {
		attributes: new Map(),
		functions: []
	};
	let lines = script.split('\n').map(line => line.trim());
	for (let line of lines.filter(line => /^\w+\./.test(line))) {
		line = line.replace(/^\w+\./, '');
		if (line.includes('=')) {
			let [property, value] = line.split(/\s*=\s*/);
			if (typeof value == 'string') {
				value = value.replace(/,$/, '');
				switch(property) {
					case 'fillStyle':
						if (!gAttributes.has('fill'))
							gAttributes.set('fill', value);
						else if (value !== gAttributes.get('fill'))
							currentPath.attributes.set('fill', value);
						break;
					case 'strokeStyle':
						if (!gAttributes.has('stroke'))
							gAttributes.set('stroke', value);
						else if (value !== gAttributes.get('stroke'))
							currentPath.attributes.set('stroke', value);
						break;
				}
			}
		} else {
			let arguments = line.replace(/.*\(|\).*/g, '').split(/\s*,\s*/);
			switch(line.replace(/(?<=\w)[^A-Za-z]+/, '')) {
				case 'arc':
					arguments[4] % 2 * Math.PI < 1 && paths.push('<circle cx="' + arguments[0] + '" cy="' + arguments[1] + '" r="' + arguments[2] + '" />');
					break;
				case 'beginPath':
				case 'fill':
				case 'stroke':
					if (currentPath.functions.length > 0) {
						paths.push('<path d="' + currentPath.functions.join(' ') + '"' + (currentPath.attributes.size > 0 ? ' ' + Array.from(currentPath.attributes.entries()).map(([key, value]) => key + '=' + value).join(' ') : '') + ' />');
						currentPath.attributes.clear();
						currentPath.functions.splice(0);
					}
					break;
				case 'bezierCurveTo':
					let lastFunction = currentPath.functions.at(-1);
					if (lastFunction.endsWith(arguments.slice(0, 2).join(' '))) {
						currentPath.functions.push('Q ' + arguments.slice(2).map((coord, index, coords) => {
							return coord + (index % 2 && index < coords.length - 1 ? ',' : '')
						}).join(' '));
					}

					currentPath.functions.push('C ' + arguments.map((coord, index, coords) => {
						return coord + (index % 2 && index < coords.length - 1 ? ',' : '')
					}).join(' '));
					break;
				case 'closePath':
					currentPath.functions.length > 0 && currentPath.functions.push('Z');
					break;
				case 'lineTo':
					currentPath.functions.push('L ' + arguments.join(' '));
					break;
				case 'moveTo':
					currentPath.functions.push('M ' + arguments.join(' '));
					break;
			}
		}
	}

	return '<g ' + Array.from(gAttributes.entries()).map(([key, value]) => key + '=' + value).join(' ') + '>\n\t' + paths.join('\n\t') + '\n</g>'
}