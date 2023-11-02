const result = document.querySelector('#preview');

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

function updatePreview() {
	let head = document.querySelector('input[name="head"]:checked + svg');
	let hat = document.querySelector('input[name="hat"]:checked + svg');
	console.log('hello', head, hat)
}