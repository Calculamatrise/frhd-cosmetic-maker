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
	let parser = new DOMParser();
	let head = document.querySelector('input[name="head"]:checked + img');
	let hat = document.querySelector('input[name="hat"]:checked + img');
	let combined = [];
	head && (combined.push(...await fetch(head.getAttribute('src')).then(r => r.text()).then(r => parser.parseFromString(r, 'image/svg+xml')).then(r => r.querySelector('svg').children)));
	hat && (combined.push(...await fetch(hat.getAttribute('src')).then(r => r.text()).then(r => parser.parseFromString(r, 'image/svg+xml')).then(r => r.querySelector('svg').children)));
	console.log('hello', head, hat, combined)
	preview.replaceChildren(...combined);
}