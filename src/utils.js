export function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function addButtonToRemoveParentContainer(parentContainer, buttonText, callback) {
	const btnDelete = document.createElement("button");
	btnDelete.className = "btn-delete";
	btnDelete.textContent = buttonText;
	btnDelete.addEventListener("click", () => {
		if (parentContainer) {
			parentContainer.remove();
			if (callback) {
				callback();
			}
		};
	});
	parentContainer.append(btnDelete);
};
