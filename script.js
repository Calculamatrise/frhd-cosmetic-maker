const preview = document.querySelector('#preview');
for (const option of document.querySelectorAll('input[name="head"]')) {
	option.addEventListener('click', event => {
		updatePreview();
	});
}

for (const option of document.querySelectorAll('input[name="hat"]')) {
	option.addEventListener('click', event => {
		updatePreview();
	});
}

updatePreview();

async function updatePreview() {
	let head = document.querySelector('input[name="head"]:checked + img');
	let hat = document.querySelector('input[name="hat"]:checked + img');
	let combined = [];
	head && (combined.push(...await getItem(head)));
	hat && (combined.push(...await getItem(hat)));
	console.log('hello', head, hat, combined)
	preview.replaceChildren(...combined);
}

const parser = new DOMParser();
function getItem(image) {
	return fetch(image.getAttribute('src')).then(r => r.text()).then(r => parser.parseFromString(r, 'image/svg+xml')).then(r => r.querySelector('svg').children);
}