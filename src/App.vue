<template>
  <div id="app">
    <h3>RFKC CWLA Expense Form</h3>
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset" v-if="show">

      <b-container class="my-4">
        <b-form-row class="p-1">
          <b-col>
            <b-form-input
                type="text"
                v-model="name"
                required
                placeholder="Name">
            </b-form-input>
          </b-col>

          <b-col>
            <b-form-file
                v-model="file"
                :state="Boolean(file)"
                placeholder="Receipt Image"
                accept="image/*,application/pdf">
            </b-form-file>
          </b-col>
        </b-form-row>
      </b-container>

      <!-- <div class="mt-3">Selected file: {{file && file.name}}</div> -->

      <b-form-checkbox
          class="my-4"
          v-model="itemize"
          @change="toggleItemize">Itemize Expenses (multiple expenses on one receipt)</b-form-checkbox>

      <b-container class="my-4" fluid>
        <b-form-row v-if="itemize">
          <b-col cols="3">
            <label>Receipt Total Tax</label>
            <b-form-input type="number"
                          min="0.00"
                          max="99999.00"
                          step="0.01"
                          v-model.number="taxTotal">
            </b-form-input>
          </b-col>
          <b-col cols="3">
            <label>Receipt Total w/ Tax</label>
            <b-form-input type="number"
                          min="0.00"
                          max="99999.00"
                          step="0.01"
                          v-model.number="total">
            </b-form-input>
          </b-col>
          <b-col cols="2">
            Tax Rate: {{ toPercent(taxRate) }}
          </b-col>
        </b-form-row>

        <b-form-row class="my-4">
          <b-col cols="2">Budget Category</b-col>
          <b-col cols="2">Date</b-col>
          <b-col cols="2">Description (optional)</b-col>
          <b-col cols="2">Vendor</b-col>
          <b-col cols="2">Amount</b-col>
          <b-col cols="1" v-if="itemize">w/ Tax</b-col>
          <b-col cols="1" v-if="itemize"></b-col>
        </b-form-row>

        <b-form-row class="my-4" v-for="(exp, idx) in expenses" :key="idx">
          <Expense :itemize="itemize" :taxRate="taxRate" v-model="expenses[idx]" :isFirst="idx == 0" :categories="optionGroups" @remove="removeExpense(idx)"/>
        </b-form-row>

        <b-form-row class="my-4" v-if="itemize">
          <b-col cols="3" offset="5"><strong>Expense Totals</strong></b-col>
          <b-col cols="2"><strong>{{ toCurrency(preTaxTotal) }}</strong></b-col>
          <b-col cols="1"><strong>{{ toCurrency(postTaxTotal) }}</strong></b-col>
        </b-form-row>

        <b-form-row class="my-4" v-if="itemize">
          <b-button @click="addExpense">Add Expense</b-button>
        </b-form-row>

      </b-container>

      <!-- <b-table class="my-4" striped hover :items="expenses" :fields="fields" v-if="itemize">
        <template slot="categoryAndExpense" slot-scope="data">
          {{data.item.category.category}} <span v-show="data.item.category.category">></span> {{data.item.category.expense}}
        </template>
      </b-table> -->


      <div class="my-5">
        <b-button size="lg" type="submit" variant="primary">Submit</b-button>
        <b-button size="lg" type="reset" variant="danger">Reset</b-button>
      </div>

    </b-form>
  </div>
</template>

<script>
import axios from 'axios'
import Expense from './components/Expense.vue'
import { store } from './store'

const expense = {
  category: {
    category: null,
    expense: null,
  },
  date: null,
  description: null,
  amount: null,
  vendor: null
}

function newExpense() {
  return JSON.parse(JSON.stringify(expense))
}

export default {
  name: 'app',
  components: {
    Expense
  },
  data() {
    return {
      show: true,
      itemize: false,
      expenses: [newExpense()],
      file: null,
      name: null,
      total: null,
      taxTotal: null,
      optionGroups: {},
    }
  },
  computed: {
    taxRate() {
      return this.taxTotal / this.total
    },
    preTaxTotal() {
      return this.expenses.reduce((sum, expense) => sum + +expense.amount, 0)
    },
    postTaxTotal() {
      if (isNaN(this.taxRate) || this.taxRate > 1) {
        return this.preTaxTotal
      }
      return this.preTaxTotal * (1 + this.taxRate)
    }
  },
  mounted() {
    axios
      .get('../categories.json')
      .then(response => (this.optionGroups = response.data))
  },
  methods: {
    toPercent(value) {
      if (typeof value !== "number" || isNaN(value) || value == Infinity) {
          return ''
      }
      return (value * 100).toFixed(2) + '%'
    },
    toCurrency(value) {
      if (typeof value !== "number" || isNaN(value) || value == Infinity) {
          return value
      }
      var formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
      })
      return formatter.format(value);
    },
    onSubmit() {
      store.save({
        name: this.name,
        file: this.file,
        expenses: this.expenses,
        taxRate: this.taxRate ? this.taxRate : 0,
      })
      this.onReset()
      alert('Expenses Submitted')
    },
    onReset() {
      this.name = null
      this.file = null
      this.itemize = false
      this.expenses = [newExpense()]
      this.show = false
      this.$nextTick(() => {
          this.show = true
      })
    },
    addExpense() {
      this.expenses.push(newExpense())
    },
    removeExpense(idx) {
      this.expenses.pop(idx)
    },
    toggleItemize(e) {
      if (!e) {
        this.expenses.length = 1
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
