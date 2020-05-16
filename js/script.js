let budgetController = (function() {
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        }
    };
    return {
        addItem: function(type, des, val) {
            let item, id;
            if (type ==='exp') {
                id = data.allItems[type].length > 0? (data.allItems[type][data.allItems[type].length-1].id + 1) : 0;
                item = new Expense(id,des,val);
            }
            else if (type ==='inc') {
                id = data.allItems[type].length > 0? (data.allItems[type][data.allItems[type].length-1].id + 1) : 0;
                item = new Income(id,des,val);
            }
            data.allItems[type].push(item);
            data.totals[type] += val;
            return item;

        },
        updateBudget: function() {
            
        }
    }
    
})();

let UIController = (function() {
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer:'.expenses__list',
        budgetValue: '.budget__value',
        budgeIncomeValue: '.budget__income--value',
        budgeExpenseValue: '.budget__expenses--value',
        budgetPrecentage: '.budget__expenses--percentage'
    }
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: function(item, type) {
            let html, ele;
            if (type === 'inc') {
                ele = DOMstrings.incomeContainer;
                html =`<div class="item clearfix" id="income-${item.id}">
                            <div class="item__description">${item.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${item.value.toFixed(2)}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`
            }
            else if (type === 'exp') {
                ele = DOMstrings.expenseContainer;
                html = `<div class="item clearfix" id="expense-${item.id}">
                        <div class="item__description">${item.description}</div>
                        <div class="right clearfix">
                            <div class="item__value">${item.value.toFixed(2)}</div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`
            }
            document.querySelector(ele).insertAdjacentHTML('beforeend',html);
        },

        clearFields: function() {
            let fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            let arrFields = Array.prototype.slice.call(fields);
            arrFields.forEach(item => {item.value = "";});
            arrFields[0].focus();
        },

        displayBudget: function(data) {
            document.querySelector(DOMstrings.budgeIncomeValue).textContent = data.totals.inc.toFixed(2);
            document.querySelector(DOMstrings.budgeExpenseValue).textContent = data.totals.exp.toFixed(2);
            document.querySelector(DOMstrings.budgetPrecentage).textContent = (data.totals.exp / data.totals.inc * 100).toFixed(0) + '%';
            document.querySelector(DOMstrings.budgetValue).textContent = (data.totals.inc - data.totals.exp).toFixed(2);
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();

let globalController = (function(budgetCtrl, UICtrl) {
    let setupEventListener = function() {
        let DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if ((event.keyCode === 13) || (event.which === 13))
                ctrlAddItem();
        });
    }
    
    let ctrlAddItem = function() {
        let input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            let newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem, input.type);
            budgetCtrl.updateBudget();
            UICtrl.clearFields();
        }
    };

    return {
        init: function() {
            setupEventListener();
        }
    };
    
})(budgetController, UIController);

globalController.init();