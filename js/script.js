let budgetController = (function() {
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
    };
    Expense.prototype.calcPer = function (totalInc) {
        this.percentage = totalInc>0? Math.round(this.value/totalInc*100) : -1;
    };
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }
    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    };
    return {
        addItem: (type, des, val) => {
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
        deleteItem: (type,ID) => {
            let IDArr = data.allItems[type].map(item => item.id);
            let indItem = IDArr.indexOf(ID);
            if (indItem !== -1) {
                data.totals[type] -= data.allItems[type][indItem].value;
                data.allItems[type].splice(indItem, 1);
            }
        },
        calculateBudget: () => {
            data.budget = data.totals.inc - data.totals.exp;
            data.percentage = data.totals.inc>0? Math.round(data.totals.exp/data.totals.inc*100) : -1;
        },
        calculatePercentages: () => {
            data.allItems.exp.forEach( item => item.calcPer(data.totals.inc));
        },
        getPercentages: () => {
            return data.allItems.exp.map( item => item.getPercentage());
        },
        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
                data: data
            }
        }
    }
    
})();

let UIController = ( () => {
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer:'.expenses__list',
        budgetValue: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpenseValue: '.budget__expenses--value',
        budgetPrecentage: '.budget__expenses--percentage',
        container: '.container',
        itemPercentage: '.item__percentage',
        titleMonth: '.budget__title--month'
    };
    let formatNumber = (num, type) => {
        if (!type) 
            num>0? type = 'inc':'exp';
        num = Math.abs(num).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        return num==0? num: (type === 'inc'? '+ ' : '- ') + num;
    };
    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: (item, type) => {
            let html, ele;
            if (type === 'inc') {
                ele = DOMstrings.incomeContainer;
                html =`<div class="item clearfix" id="inc-${item.id}">
                            <div class="item__description">${item.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber(item.value, type)}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`
            }
            else if (type === 'exp') {
                ele = DOMstrings.expenseContainer;
                html = `<div class="item clearfix" id="exp-${item.id}">
                        <div class="item__description">${item.description}</div>
                        <div class="right clearfix">
                            <div class="item__value">${formatNumber(item.value, type)}</div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`
            }
            document.querySelector(ele).insertAdjacentHTML('beforeend',html);
        },

        removeListItem: (id) => {
            document.getElementById(id).parentNode.removeChild(document.getElementById(id));
        },

        clearFields: () => {
            let fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            let arrFields = Array.prototype.slice.call(fields);
            arrFields.forEach(item => {item.value = "";});
            arrFields[0].focus();
        },

        displayBudget: (data) => {
            document.querySelector(DOMstrings.budgetIncomeValue).textContent = formatNumber(data.totalInc, 'inc');
            document.querySelector(DOMstrings.budgetExpenseValue).textContent = formatNumber(data.totalExp, 'exp');
            document.querySelector(DOMstrings.budgetValue).textContent = formatNumber(data.budget);
            data.percentage>0? document.querySelector(DOMstrings.budgetPrecentage).textContent = data.percentage + '%' 
                : document.querySelector(DOMstrings.budgetPrecentage).textContent = '---';
        },
        displayPercentages: (percentages) => {
            let fields = document.querySelectorAll(DOMstrings.itemPercentage);
            Array.prototype.slice.call(fields).forEach((item, i) => percentages[i]>0? item.textContent = percentages[i] +'%': '---');
        },
        displayMonth: () => {
            let input,inputArr, date, year, month, months;
            months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            input = prompt('Please enter the month and year by format: mm-yyyy\nIf want current month, press \'Enter\'');
            if (input === '') {
                date = new Date();
                year = date.getFullYear();
                month = date.getMonth()
            }
            else {
                inputArr = input.split('-');
                year = parseInt(inputArr[1]);
                month = parseInt(inputArr[0] -1);
            }
            document.querySelector(DOMstrings.titleMonth).textContent = months[month] + ', ' + year;
        },
        changeType: () => {
            let fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            Array.prototype.slice.call(fields).forEach(item => item.classList.toggle('red-focus'));
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        getDOMstrings: () => {
            return DOMstrings;
        } 
    }
})();

let globalController = ( (budgetCtrl, UICtrl) => {
    let setupEventListener = () => {
        let DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if ((event.keyCode === 13) || (event.which === 13))
                ctrlAddItem();
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType)
    }
    
    let updateBudget = () => {
        budgetCtrl.calculateBudget();
        let budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };

    let updatePrecentages = () => {
        budgetCtrl.calculatePercentages();
        let percentages = budgetCtrl.getPercentages();
        UICtrl.displayPercentages(percentages);
    }

    let ctrlAddItem = () => {
        let input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            let newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();
            updatePrecentages();
        }
    };

    let ctrlDeleteItem = (event) => {
        let itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }
        budgetCtrl.deleteItem(type, ID);
        UICtrl.removeListItem(itemID);
        updateBudget();
        updatePrecentages();
    };

    return {
        init: () => {
            setupEventListener();
            UICtrl.displayMonth();
            UICtrl.displayBudget({ 
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            });
        }
    };
    
})(budgetController, UIController);

globalController.init();