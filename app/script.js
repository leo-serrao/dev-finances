const modalBtn = document.querySelector('.button.new')
const cancelBtn = document.querySelector('.button.cancel')
const modal = document.querySelector('.modal-overlay')

function openModal() {
  modal.classList.add('active')
}

function closeModal() {
  modal.classList.remove('active')
}

modalBtn.addEventListener('click', openModal)
cancelBtn.addEventListener('click', closeModal)
