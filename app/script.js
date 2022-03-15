//----------  ABRE/FECHA O MODAL --------------//
const modalBtn = document.querySelector('.button.new')
const cancelBtn = document.querySelector('.button.cancel')
const modal = document.querySelector('.modal-overlay')

function toggleModal() {
  if (modal.classList === 'modal-overlay active') {
    modal.classList.toggle('active')
  } else {
    modal.classList.toggle('active')
  }
}

modalBtn.addEventListener('click', toggleModal)
cancelBtn.addEventListener('click', toggleModal)

//----------  FUNCIONALIDADES DA PÁGINA --------------//

//-----  Arr com as transações exibidas na tabela -----//
const transactions = [
  {
    id: 1,
    description: 'Luz',
    amount: -50000,
    date: '15/03/2022'
  },
  {
    id: 2,
    description: 'Website',
    amount: 500000,
    date: '15/03/2022'
  },
  {
    id: 3,
    description: 'Internet',
    amount: -20000,
    date: '15/03/2022'
  }
]

//-----  Calculos de entrada, saída e total -----//
const Transaction = {
  //-----  Calcula as entradas -----//
  incomes() {
    let income = 0

    transactions.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })

    return income
  },
  //-----  Calcula as saídas -----//
  expenses() {
    let expense = 0

    transactions.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })

    return expense
  },
  //-----  Calcula o total -----//
  total() {
    let total = 0

    transactions.forEach(transaction => {
      total = this.incomes() + this.expenses()
    })

    return total
  }
}

//----- Funcionalidades ligadas ao DOM -----//
const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  //-----  Insere o elemento criado na tabela -----//
  addTransaction(transaction) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)

    DOM.transactionsContainer.appendChild(tr)
  },

  //-----  Cria o elemento da tabela -----//
  innerHTMLTransaction(transaction) {
    const CSSClass = transaction.amount > 0 ? 'income' : 'expense'

    const amount = utils.formatCurrency(transaction.amount)

    const html = ` 
    
      <td class="description">${transaction.description}</td>
      <td class="${CSSClass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img src="../assets/minus.svg" alt="Remover transação" />
      </td>
    `

    return html
  },

  //-----  Atualiza os valores exibidos de entrada, saída e total -----//
  updateBalance() {
    document.getElementById('income-display').innerHTML = utils.formatCurrency(
      Transaction.incomes()
    )

    document.getElementById('expense-display').innerHTML = utils.formatCurrency(
      Transaction.expenses()
    )

    document.getElementById('total-display').innerHTML = utils.formatCurrency(
      Transaction.total()
    )
  }
}

//----- Utilidades -----//
const utils = {
  //-----  Formata os valores da tabela -----//
  formatCurrency(value) {
    //-----  Verifica +/- e atribui sinal se necessário -----//
    const signal = Number(value) < 0 ? '-' : ''

    //-----  Converte valor p/ string e remove tudo que não for número  -----//
    value = String(value).replace(/\D/g, '')

    //-----  Converte p/ number e divide por cem p/ atribuir casas decimais -----//
    value = Number(value) / 100

    //-----  Formata para valor em R$ -----//
    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return signal + value
  }
}

transactions.forEach(transaction => {
  DOM.addTransaction(transaction)
})

DOM.updateBalance()
