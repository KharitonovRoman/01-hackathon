export function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//функция создания крестика и удаления блока parrentContainer
export function createCross(parrentContainer) {
	//верстка крестика удалить
	const btnDelete = document.createElement("button");
	btnDelete.className = "btn-delete";
	btnDelete.textContent = '✖';
	parrentContainer.append(btnDelete);

	// Удаление блока нажав на крестик
	btnDelete.addEventListener("click", () => {
		if (parrentContainer) {
			parrentContainer.remove();
			};
		});
};
