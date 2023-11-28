(function () {
  let dealsArr = [];
  let storageName;

  //Функция сохраняющая наши данные в Local Storage
  function sendToLocalStorage() {
    localStorage.setItem(storageName, JSON.stringify(dealsArr));
  }

  //Функция извлекающая данные из Local Storage
  function getFromLocalStorage() {
    let ls = localStorage.getItem(storageName);
    return JSON.parse(ls);
  }

  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.setAttribute('id', 'form-to-fill');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.setAttribute('id', 'button-to-submit');
    button.disabled = true;

    input.addEventListener('input', function () {
      if (input.value === '') {
        button.disabled = true;
      }
      else {
        button.disabled = false;
      }
    })

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return { form, input, button, };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(object) {
    let item = document.createElement('li');
    // кнопки в группирующий элемент

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части при помощи flex

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = object.name;
    //console.log('Name of object added')

    if (object.done == true) {
      item.classList.add('list-group-item-success');
      //console.log('Deal is succeed')
    }

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');
      dealsArr[item.id].done = !dealsArr[item.id].done;
      sendToLocalStorage();
      console.log(dealsArr);
    });

    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();
        dealsArr.splice(item.getAttribute('id'), 1);
        // dealsArr = dealsArr.filter(e => e.id == !item.id);

        //После удаления мы меняем id элементам, которые были после удаленного элемента (если таковы имеются)
        //Меняем id в HTML у элементов li
        let ulItems = document.getElementsByClassName('list-group-item');
        for (let i = 0; i < ulItems.length; ++i) {
          ulItems[i].id = i;
          // console.log(ulItems[i].id);
        }
        //Меняем id в нашем массиве
        for (let i = 0; i < dealsArr.length; ++i) {
          dealsArr[i].id = i;
          // let li = document.querySelectorAll('li');
          // li.forEach(function(item) {
          //   if(item.innerHTML == dealsArr[i].name) {
          //     item.setAttribute('id', dealsArr[i].id);
          //   }
          // })
          // console.log(dealsArr[i].id);
        }
        sendToLocalStorage();
        console.log(dealsArr);
      }
    });

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return { item, doneButton, deleteButton, };

  }

  function createTodoApp(container, title = 'Список дел', listName) {

    let containerN = document.getElementById(container);

    storageName = listName;

    // console.log('In storage we have:', getFromLocalStorage());

    // for (let i = 0; i < storageInfo.length; ++i) {
    //   itemFromStorage = createTodoItem(storageInfo[i]);
    //   itemFromStorage.item.setAttribute('id', storageInfo[i].id);
    // }

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    containerN.append(todoAppTitle);
    containerN.append(todoItemForm.form);
    containerN.append(todoList);

    //При запуске приложения создается список элементов на основании Local Storage
    let storageInfo = getFromLocalStorage();
    // console.log(storageInfo);

    if (storageInfo == null) {}
    else if (storageInfo.length > 0) {
      for (let i = 0; i < storageInfo.length; ++i) {
        let storageInfoElem = createTodoItem(storageInfo[i]);
        storageInfoElem.item.setAttribute('id', storageInfo[i].id);
        dealsArr.push(storageInfo[i]);
        todoList.append(storageInfoElem.item);
      }
    }


    // функция submit через кнопку или Enter
    todoItemForm.form.addEventListener('submit', function (e) {
      // отключает дефолтные сеттинги (обновление страницы)
      e.preventDefault();

      // если строка пуста - возвращаем ничего
      // if (!todoItemForm.input.value) {
      //   // alert('Форма обязательна к заполнению!')
      //   return;
      // }

      // основной код, значение из input переводим в элемент li
      //Объект будет иметь id равный длине массива, такой же id присваивается и элементу li
      let newObject = {
        name: todoItemForm.input.value,
        done: false,
        id: dealsArr.length,
      }

      let todoItem = createTodoItem(newObject);

      todoItem.item.setAttribute('id', newObject.id);

      dealsArr.push(newObject);

      console.log(dealsArr);

      // console.log(todoItem.item);

      todoList.append(todoItem.item);

      sendToLocalStorage();

      // по окончанию обнуляем (очищаем) строку для ввода
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
