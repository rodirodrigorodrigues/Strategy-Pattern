// Code merely illustrative to show how the Strategy-Pattern pattern was used

class HealthForm {
  alerts = [];
  selectedTab = null;

  constructor(store = {}) {
    const options = store.options;
    const loading = store.loading.getOptions ?? true;

    // Strategy-Pattern
    this.fieldHandlers = {
      operator: () => {
        this.updatePlansByOperator(store)
        // future validation: this.futureValidation(),
      }
    };

    this.fields = {
      operator: {
        type: 'combobox',
        classes: ['col-span-6'],
        label: 'Operadora',
        value: null,
        options: options?.operators || [],
        identifiers: ['name', 'id'],
        loading: loading,
      },
      plan: {
        readonly: true,
        type: 'combobox',
        classes: ['col-span-6'],
        label: 'Plano',
        value: null,
        options: options?.plans || [],
        identifiers: ['name', 'id'],
        loading: loading,
      }
    };
  }

  updatePlansByOperator(store) {
    const allPlans = store.options?.plans || [];
    const selectedOperatorId = store.healthForm.fields.operator.value || null;
    const filteredPlans = allPlans.filter(plan => plan.operatorId === selectedOperatorId);

    Object.assign(store.healthForm.fields.plan, {
      options: filteredPlans,
      readonly: filteredPlans.length === 0,
      value: null
    });
  }

  setOptions({ options }) {
    this.fields.operator.options = options.operators;
    this.fields.operator.loading = false;
    this.fields.plan.options = options.plans;
    this.fields.plan.loading = false;
  }

  values(store) {
    return {
      operator: this.fields.operator.value,
      plan: this.fields.plan.value,
    };
  }
}

// Código Vue.js

// Make use Strategy-Pattern
changeHealthForm([key, value]) {
  this.healthForm.fields[key].value = value;
  const handler = this.healthForm.fieldHandlers[key];
  if (handler) {
    handler(value);
  }
},
