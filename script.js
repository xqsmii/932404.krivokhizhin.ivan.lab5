const PROJECTS_KEY = "projects";
const THEME_KEY = "theme";

// Проекты, которые показываются при первом открытии страницы
const defaultProjects = [
  {
    title: "Консольный менеджер задач",
    description: "Программа на C++ для добавления, удаления и просмотра задач прямо из консоли."
  },
  {
    title: "База данных учёта студентов",
    description: "Реляционная база данных на SQL: таблицы студентов, групп и оценок, а также запросы к ним."
  },
  {
    title: "Построение графиков на Python",
    description: "Скрипты на Python с библиотекой matplotlib: гистограммы и комбинированные графики."
  }
];

function init() {
  // Поиск элементов и проверка их существования
  const container = document.querySelector("#projects-list");
  const addBtn = document.getElementById("add-btn");
  const removeBtn = document.getElementById("remove-btn");
  const toggleBtn = document.getElementById("toggle-btn");
  const themeBtn = document.getElementById("theme-btn");

  if (!container || !addBtn || !removeBtn || !toggleBtn || !themeBtn) {
    console.error("Не найден контейнер или одна из кнопок. Скрипт не выполнен.");
    return;
  }

  // ----- Создание карточки -----
  function createCard(title, description) {
    const card = document.createElement("article");
    card.className = "card";

    const h3 = document.createElement("h3");
    h3.textContent = title;

    const p = document.createElement("p");
    p.textContent = description;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card-btn";
    btn.textContent = "Подробнее";
    btn.setAttribute("aria-expanded", "false");

    card.appendChild(h3);
    card.appendChild(p);
    card.appendChild(btn);
    return card;
  }

  // ----- localStorage: проекты -----
  function saveProjects() {
    const cards = container.querySelectorAll(".card");
    const data = [];
    cards.forEach(function (card) {
      data.push({
        title: card.querySelector("h3").textContent,
        description: card.querySelector("p").textContent
      });
    });
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(data));
  }

  function loadProjects() {
    let data = null;
    try {
      data = JSON.parse(localStorage.getItem(PROJECTS_KEY));
    } catch (e) {
      console.error("Не удалось прочитать сохранённые проекты:", e);
    }
    if (!Array.isArray(data)) {
      data = defaultProjects;
    }
    data.forEach(function (item) {
      container.appendChild(createCard(item.title, item.description));
    });
  }

  // ----- Тема -----
  function applyTheme(theme) {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(theme);
    themeBtn.textContent = theme === "theme-dark" ? "Светлая тема" : "Тёмная тема";
  }

  // ----- Восстановление состояния при загрузке -----
  loadProjects();
  applyTheme(localStorage.getItem(THEME_KEY) === "theme-dark" ? "theme-dark" : "theme-light");

  // ----- Добавить проект -----
  addBtn.addEventListener("click", function () {
    const title = prompt("Название проекта:");
    if (title === null || title.trim() === "") {
      return;
    }
    const description = prompt("Описание проекта:");
    if (description === null) {
      return;
    }
    container.appendChild(createCard(title.trim(), description.trim()));
    saveProjects();
  });

  // ----- Удалить последний -----
  removeBtn.addEventListener("click", function () {
    const cards = container.querySelectorAll(".card");
    if (cards.length > 0) {
      cards[cards.length - 1].remove();
      saveProjects();
    } else {
      console.log("Нет проектов для удаления");
      alert("Список пуст");
    }
  });

  // ----- Свернуть / развернуть -----
  toggleBtn.addEventListener("click", function () {
    const isHidden = container.classList.toggle("hidden");
    toggleBtn.textContent = isHidden ? "Развернуть проекты" : "Свернуть проекты";
  });

  // ----- Переключение темы -----
  themeBtn.addEventListener("click", function () {
    const next = document.body.classList.contains("theme-dark") ? "theme-light" : "theme-dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // ----- Кнопка «Подробнее» (делегирование событий) -----
  container.addEventListener("click", function (event) {
    const btn = event.target.closest(".card-btn");
    if (!btn) {
      return;
    }
    const card = btn.closest(".card");
    const expanded = card.classList.toggle("expanded");
    btn.textContent = expanded ? "Скрыть" : "Подробнее";
    btn.setAttribute("aria-expanded", String(expanded));
  });
}

init();
