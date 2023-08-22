class Interface {
  constructor() {
    this.app = document.querySelector(".app");

    this.arr = new Array(5);
    this.arrOfUnique = new Array();

    this.appInput = document.createElement("input");
    this.appInput.classList.add("app__input");
    this.appInput.placeholder = "Enter the text...";
    this.appInput.addEventListener("keyup", this.debounce(this.findInfo, 500));
    this.app.appendChild(this.appInput);

    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("app__wrapper");
    this.app.appendChild(this.wrapper);

    this.appMenu = document.createElement("ul");
    this.appMenu.classList.add("menu");
    this.appMenu.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        this.addItemToList(this.arr[e.target.id]);
      }
    });
    this.wrapper.appendChild(this.appMenu);

    this.appWarning = document.createElement("div");
    this.appWarning.classList.add("warning");
    this.appWarning.textContent = "This repository is already in list!";
    this.wrapper.appendChild(this.appWarning);

    this.appList = document.createElement("ul");
    this.appList.classList.add("list");
    this.appList.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        this.removeItemFromList(this.appList, e.target.parentNode);
      }
    });
    this.wrapper.appendChild(this.appList);
  }

  addItemToList(menuItem) {
    if (!this.arrOfUnique.includes(menuItem.id)) {
      this.arrOfUnique.push(menuItem.id);

      this.listItem = document.createElement("li");
      this.listItem.classList.add("list__item");
      this.listItem.id = menuItem.id;

      this.listItemName = document.createElement("h5");
      this.listItemName.classList.add("list__item-name");
      this.listItemName.textContent = `Name: ${menuItem.name}`;

      this.listItemOwner = document.createElement("span");
      this.listItemOwner.classList.add("list__item-owner");
      this.listItemOwner.textContent = `Owner: ${menuItem.owner.login}`;

      this.listItemStars = document.createElement("span");
      this.listItemStars.classList.add("list__item-stars");
      this.listItemStars.textContent = `Stars: ${menuItem.stargazers_count}`;

      this.listItemClose = document.createElement("button");
      this.listItemClose.classList.add("list__item-close");

      this.listItem.appendChild(this.listItemName);
      this.listItem.appendChild(this.listItemOwner);
      this.listItem.appendChild(this.listItemStars);
      this.listItem.appendChild(this.listItemClose);

      this.appList.appendChild(this.listItem);

      this.appInput.value = "";
      this.removeMenu();
    } else {
      this.appWarning.classList.add("warning--active");
      setTimeout(
        () => this.appWarning.classList.remove("warning--active"),
        2500
      );
    }
  }

  removeMenu() {
    this.appMenu.classList.remove("menu--active");
    this.appMenu.innerHTML = "";
    this.arr = new Array(5);
  }
  removeItemFromList(parent, child) {
    parent.removeChild(child);
    this.arrOfUnique.splice(this.arrOfUnique.indexOf(child.id), 1);
  }

  showMenu(item, index) {
    if (this.appMenu && this.appMenu.children.length === 5) this.removeMenu();
    if (!this.arr.map((e) => e.id).includes(item.id)) {
      this.arr[index] = item;

      this.appMenu.classList.add("menu--active");

      this.menuItem = document.createElement("li");
      this.menuItem.classList.add("menu__item");
      this.menuItem.textContent = item.name;
      this.menuItem.id = index;

      this.appMenu.appendChild(this.menuItem);
    }
  }

  findInfo = async () => {
    if (this.appInput.value.trimStart()) {
      return await fetch(
        `https://api.github.com/search/repositories?q=${this.appInput.value}&per_page=5`
      ).then((response) => {
        if (response.ok)
          response
            .json()
            .then((jsonInfo) =>
              jsonInfo.items.forEach((infoItem, index) =>
                this.showMenu(infoItem, index)
              )
            );
      });
    } else if (this.appMenu.innerHTML) this.removeMenu();
  };

  debounce = (fn, debounceTime) => {
    let timeState;
    return function (...arg) {
      clearTimeout(timeState);
      timeState = setTimeout(() => fn.call(this, ...arg), debounceTime);
    };
  };
}
const app = new Interface();
