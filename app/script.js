//----------  ABRE/FECHA O MODAL  --------------//

const Modal = {
  open() {
    const modal = document.querySelector('.modal-overlay')
    modal.classList.toggle('active')
  },
  close() {
    const modal = document.querySelector('.modal-overlay')
    modal.classList.toggle('active')
  }
}

//----------  FUNCIONALIDADES DA PÁGINA  --------------//

//----- Calculos de entrada, saída e total-----//

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transaction')) || []
  },
  set(transactions) {
    localStorage.setItem(
      'dev.finances:transaction',
      JSON.stringify(transactions)
    )
  }
}

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },
  //-----  Calcula as entradas -----//
  incomes() {
    let income = 0

    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })

    return income
  },
  //-----  Calcula as saídas -----//
  expenses() {
    let expense = 0

    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })

    return expense
  },
  //-----  Calcula o total -----//
  total() {
    return Transaction.incomes() + Transaction.expenses()
  }
}

//-----Funcionalidades ligadas ao DOM-----//
const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  //-----  Insere o elemento criado na tabela -----//
  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  //-----  Cria o elemento da tabela -----//
  innerHTMLTransaction(transaction, index) {
    const CSSClass = transaction.amount > 0 ? 'income' : 'expense'

    const amount = Utils.formatCurrency(transaction.amount)

    const html = ` 
    
      <td class="description">${transaction.description}</td>
      <td class="${CSSClass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="../assets/minus.svg" alt="Remover transação" />
      </td>
    `

    return html
  },

  //-----  Atualiza os valores exibidos de entrada, saída e total -----//
  updateBalance() {
    document.getElementById('income-display').innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    )

    document.getElementById('expense-display').innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    )

    document.getElementById('total-display').innerHTML = Utils.formatCurrency(
      Transaction.total()
    )
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ''
  }
}

//-----Utilidades-----//
const Utils = {
  formatAmount(value) {
    value = Number(value) * 100

    return value
  },

  formatDate(date) {
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

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

//-----Captura de dados-----//
const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()

    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Por favor, preencha todos os campos')
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  clearFields() {
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },

  submit(event) {
    event.preventDefault()

    try {
      //-----Verifica se todos os dados foram preenchidos -----//
      Form.validateFields()

      //-----Formata os dados para salvar -----//
      const transaction = Form.formatValues()

      //-----Salva os dados -----//
      Transaction.add(transaction)

      //-----Apaga os dados do formulário -----//
      Form.clearFields()

      //-----Fecha o modal-----//
      Modal.close()
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction)

    DOM.updateBalance()

    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions()

    App.init()
  }
}

App.init()
