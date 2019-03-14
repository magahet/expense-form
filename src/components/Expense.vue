<template>
  <b-container fluid class="px-1">
    <b-form-row>
      <b-col cols="2">
        <b-select size="sm" v-model="expense.category" @input="update()">
          <option value="null">Expense Category</option>
          <optgroup v-for="(group, name) in categories" :label="name" :key="name">
            <option v-for="option in group" :value="option.value" :key="option.name">
              {{ option.text }}
            </option>
          </optgroup>
        </b-select>
      </b-col>

      <b-col cols="2">
        <b-input size="sm" type="date" placeholder="date" v-model="expense.date" @input="update()"></b-input>
      </b-col>

      <b-col cols="2">
        <b-input size="sm" type="text" placeholder="description" v-model="expense.description" @input="update()"></b-input>
      </b-col>

      <b-col cols="2">
        <b-input size="sm" type="text" placeholder="vendor" v-model="expense.vendor" @input="update()"></b-input>
      </b-col>

      <b-col cols="2">
        <b-input
            size="sm"
            type="number"
            min="0.00"
            max="99999.00"
            step="0.01"
            placeholder="amount"
            ref="amount"
            v-model.number="expense.amount"
            @input="update()"></b-input>
      </b-col>

      <b-col cols="1" v-if="itemize">
        {{ toCurrency(postTaxTotal) }}
      </b-col>

      <b-col cols="1">
        <b-button v-if="!isFirst" @click="$emit('remove')">Remove</b-button>
      </b-col>

    </b-form-row>

    <!-- <div>{{ value }}</div> -->

  </b-container>
</template>

<script>

export default {
  name: 'Expense',
  props: ['categories', 'value', 'isFirst', 'taxRate', 'itemize'],
  data() {
    return {
      expense: this.value
    }
  },
  computed: {
    postTaxTotal() {
      if (isNaN(this.taxRate) || this.taxRate > 1) {
        return +this.expense.amount
      }
      return this.expense.amount * (1 + this.taxRate)
    }
  },
  methods: {
    update() {
      // console.log(this.expense)
      this.$emit('input', this.expense)
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
  }
}
</script>