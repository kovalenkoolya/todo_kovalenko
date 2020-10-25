const ERROR = 'Insert your task!';
const SELECTOR = {
    SHOW_COMPLETED: 'button button__show-completed',
    SHOW_ACTIVE: 'button button__show-active',
    SHOW_ALL: 'button button__show-all',
    CLEAR_COMPLETED: '.button__clear-completed',
    PAGINATION: '.list__pagination',
    PAGINATION_LI: '.list__pagination li',
    PAGINATION_LI_ACTIVE: '.list__pagination li.active',
    ACTIVE: 'active',
    TOGGLE_ALL: '.input__toggle-all',
    COUNTER: '.counter',
    INPUT: '.input',
    LIST: '.list',
    PARAGRAPH: '.list__p',
    UNCHECK: '.fa-circle-thin',
    CHECK: '.fa-check-circle',
    ADD_TODO: '.fa-plus-square',
    DELETE_TODO: '.fa-trash',
    BUTTON: '.button',
};
const EVENT = {
  KEY_UP: 'keyup',
  CLICK: 'click',
  DOUBLE_CLICK: 'dblclick',
  BLUR: 'blur',
};
const notesOnPage = 5;

let text = '';
let validatedText = '';
let todoList = [];
let activeList = [];
let completedList = [];
let visibleList = [];
let items = [];
let notes = [];
let isAllTodosChecked = false;
let str = '';
let currentTab =  SELECTOR.SHOW_ALL;
let pageNumber = 1;

$(document).ready(() => {

  const generateHTML = (item) => {
    return  `<li id = ${item.id} class = 'list__item'>
                <i id = ${item.id} class = 'fa ${item.done ? 'fa-check-circle fa-lg' : 'fa-circle-thin fa-lg'} complete'></i>
                <p id = ${item.id} class = ' ${item.done ? 'list__p list__p_completed' : 'list__p'}'>${item.name}</p>
                <i id = ${item.id} class = 'fa fa-trash fa-lg'></i>
              </li><hr>`;
  }

  const validateInput = function(text) {
    validatedText = text.toString()
    .trim()
    .replace(/\s{2,}/g, ' ');
    console.log('VALID', validatedText);
    return validatedText;
  };

  const addToDo = function(validatedText) {
    if (!validatedText.length) {
      alert(ERROR);
      return;
    }

    todoList.push({
      id: new Date().getTime(),
      name: validatedText,
      done: false
    });
    if (todoList.length > 0) {
      $(".button").show();
    }
    console.log('TODOLIST', todoList);
    $(SELECTOR.INPUT).val("");
  };

  const render = function(currentArray) {
    str = currentArray
    .map(item => {
        return generateHTML(item);
        })
    .join('');
  $(SELECTOR.LIST).empty();
  $(SELECTOR.LIST).append(str);
  };

  const checkToDo = function(todoId) {
    let index = todoList.findIndex((item) => item.id === +todoId);
    console.log('INDEX', index);
    console.log('TODOLIST', todoList);
    todoList[index].done = true;
  };

  const uncheckToDo =  function(todoId) {
    let index = todoList.findIndex((item) => item.id === +todoId);
    console.log('INDEX', index);
    todoList[index].done = false;
    console.log('TODOLIST', todoList);
  };

  const deleteToDo  = function(todoId) {
    const index = todoList.findIndex((item) => item.id === +todoId);
    todoList.splice(index, 1);
    if (todoList.Length === 0) {
      $('.button').hide();
    }
  };

  const checkAll = function() {
    for (let i = 0; i < todoList.length; i += 1) {
    todoList[i].done = true;
    }
  };

  const uncheckAll = function() {
    for (let i = 0; i < todoList.length; i += 1) {
      todoList[i].done = false;
    }
  };

  const clearCompleted = function() {
    todoList = todoList.filter(item => item.done === false);
    console.log('TODOLIST' , todoList);
    if (todoList.length === 0) {
      $('.button').hide();
    }
  };

  const filter = function() {
    if (currentTab === SELECTOR.SHOW_COMPLETED) {
      visibleList = todoList.filter(item => item.done === true);
      console.log('VISIBLE LIST', visibleList);
      const index = todoList.findIndex((item) => item.done == false);

      if (index === -1) {
        $(SELECTOR.TOGGLE_ALL).prop('checked', true);
      }

      $(SELECTOR.COUNTER).html(`<span>Completed tasks: ${visibleList.length}</span>`);

    } else if (currentTab === SELECTOR.SHOW_ACTIVE ) {
      visibleList =  todoList.filter(item => item.done === false);
      const index = todoList.findIndex((item) => item.done === false);

      if (index === -1) {
         $(SELECTOR.TOGGLE_ALL).prop('checked', true);
      }

      console.log('VISIBLE LIST', visibleList);
      $(SELECTOR.COUNTER).html(`<span>Active tasks: ${visibleList.length}</span>`);
    } else  {
      visibleList = todoList;
      console.log('VISIBLE LIST', visibleList);
      $(SELECTOR.COUNTER).html(`<span>Total tasks: ${visibleList.length}</span>`);
    }
  };

  const createPAgeNumbers = function() {
    $(SELECTOR.PAGINATION).html('');
    const countOfItems = Math.ceil(visibleList.length / notesOnPage);

    for (let i = 1; i <= countOfItems; i += 1) {
       let li = $('<li></li>');
       let page = li.html(i);
       $(SELECTOR.PAGINATION).append(page);
       items.push(page);
    }
  };

  const makePagination = function(pageNumber) {
    let start = (pageNumber - 1) * notesOnPage;
    let end = start + notesOnPage;
    notes = visibleList.slice(start, end);
    console.log('NOTES', notes);
    console.log('PAGENUMBER', pageNumber);
    render (notes);
  };

  $('button').hide();
  // Add todo by pressing enter
  $(document).on(EVENT.KEY_UP, SELECTOR.INPUT, (event) => {
    if (event.keyCode === 13) {
      text = $(SELECTOR.INPUT).val();
      console.log('TEXT BEFORE VALIDATION', text)
      validateInput(text);
      addToDo(validatedText);
      filter();
      createPAgeNumbers();
      $(`<li> ${pageNumber} </li>`).addClass(SELECTOR.ACTIVE);
      makePagination(pageNumber);
      $(SELECTOR.TOGGLE_ALL).prop('checked', false);
    }

});

  // Add todo  by button
  $(document).on(EVENT.CLICK, SELECTOR.ADD_TODO, () => {
    text = $(SELECTOR.INPUT).val();
    console.log('TEXT BEFORE VALIDATION', text)
    validateInput(text);
    addToDo(validatedText);
    filter();
    createPAgeNumbers();
    $(`<li> ${pageNumber} </li>`).addClass(SELECTOR.ACTIVE);
    makePagination(pageNumber);
    $(SELECTOR.TOGGLE_ALL).prop('checked', false);
  });

  // Edit todo by double click
  $(document).on(EVENT.DOUBLE_CLICK, SELECTOR.PARAGRAPH, function func() {
    const element = this;
    console.log('ELEMENT EDT', element);
    const todoId = element.id;
    console.log('TODO ID', todoId);
    const editInput = $(`<input class='edit' style='width: 90%' />`);
    $(editInput).val($(element).html());
    let newTodo = editInput.val() || '';

    // Paste new form
    $(element).html(editInput);
    // Set new value to form
    $(editInput).attr('value', validateInput(newTodo));
    // Check value in form
    $(editInput).attr('value');

    $(editInput).on(EVENT.BLUR, () => {
      newTodo = editInput.val();
      // Update todo list
      console.log('ID', todoId);
      console.log('LIST', todoList);

      let index = todoList.findIndex(item => item.id === +todoId);
      console.log('INDEX', index);
      console.log('TODO ID', todoId);
      todoList[index].name = validateInput(newTodo);
      console.log(todoList);
      filter();
      makePagination(pageNumber);
      $(element).on(EVENT.DOUBLE_CLICK, SELECTOR.PARAGRAPH, func);
    });
    $(element).off(EVENT.DOUBLE_CLICK, SELECTOR.PARAGRAPH, func);
});

  // Check todo
  $(document).on(EVENT.CLICK, SELECTOR.UNCHECK, (event) => {
    const elementId = event.target.id;
    console.log('TODO ID', elementId);
    checkToDo(elementId);
    filter();
    makePagination (pageNumber);
    const index = todoList.findIndex((item) => item.done === false);
    console.log('index', index);

    if (index === -1) {
      $(SELECTOR.TOGGLE_ALL).prop('checked', true);
    }

  });

  // Uncheck todo
  $(document).on(EVENT.CLICK,  SELECTOR.CHECK, (event) => {
    const elementId = event.target.id;
    console.log('TODO ID', elementId);
    uncheckToDo(elementId);
    filter();
    makePagination(pageNumber);
    $(SELECTOR.TOGGLE_ALL).prop('checked', false);
});

   // Delete todo
  $(document).on(EVENT.CLICK, SELECTOR.DELETE_TODO, (event) => {
    const elementId = event.target.id;
    console.log('TODO ID', elementId);
    deleteToDo(elementId);
    console.log('VISIBLE LIST', visibleList);
    filter();
    createPAgeNumbers();
    makePagination(pageNumber);

    if (visibleList.length === 0) {
        $('button').hide();
    }
  });

  // Toggle all
  $(SELECTOR.TOGGLE_ALL).on(EVENT.CLICK, () => {
    const index = todoList.findIndex((item) => item.done === false);
    console.log('index', index);

    if (index === -1) {
      uncheckAll();
      filter();
      makePagination(pageNumber);
    } else {
     checkAll();
     filter();
     makePagination(pageNumber);
    }

});

  // Clear completed
  $(SELECTOR.CLEAR_COMPLETED).on(EVENT.CLICK, () => {
    clearCompleted();
    filter();
    makePagination(pageNumber);
    $(SELECTOR.TOGGLE_ALL).prop('checked', false);
    $(SELECTOR.COUNTER).html(`<span>Completed tasks: ${visibleList.length} </span>`);
  });

   // Handler for tabs
    $(SELECTOR.BUTTON).on(EVENT.CLICK, function() {
      currentTab = $(this).attr('class');
      console.log('CURRENT TAB', currentTab);
      $(SELECTOR.TOGGLE_ALL).prop('checked', false);
      filter();
      render(visibleList);
      createPAgeNumbers();
      pageNumber = 1;
      makePagination(pageNumber);
  });

  // Make pagination
  $(document).on(EVENT.CLICK, SELECTOR.PAGINATION_LI, function(event) {
    let active = $(SELECTOR.PAGINATION_LI_ACTIVE);

    if (active !== '') {
      active.removeClass(SELECTOR.ACTIVE);
    }

    let thisLi = event.target;
    pageNumber = $(thisLi).html();
    console.log('pageNumber', pageNumber);
    $(thisLi).addClass(SELECTOR.ACTIVE);
    console.log('ThisLi', thisLi);
    makePagination(pageNumber);
    return pageNumber;
  });

});
