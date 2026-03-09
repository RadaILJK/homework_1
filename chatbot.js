(function() {
  'use strict';

  // по умолчанию
  var defaultConfig = {
    responses: {
      'привет': 'Привет!!!',
      'ВШЭ': 'Обойди хоть всю планету лучше Вышки в мире нету!!!'
    },
    keywords: {
      'привет': ['привет', 'здравствуйте', 'хай', 'добрый день'],
      'ВШЭ': ['вшэ', 'вышк', 'вуз', 'учишься']
    },
    defaultResponse: 'Ээээ... даже не знаю, что и ответить-то :(',
    typingDelay: 700,
    recordingDuration: 2000  // Длительность имитации записи (мс)
  };

  // Класс чат-бота
  function SimpleChatbot(config) {
    this.config = config || {};
    this.responses = this.config.responses || defaultConfig.responses;
    this.keywords = this.config.keywords || defaultConfig.keywords;
    this.defaultResponse = this.config.defaultResponse || defaultConfig.defaultResponse;
    this.typingDelay = this.config.typingDelay || defaultConfig.typingDelay;
    this.recordingDuration = this.config.recordingDuration || defaultConfig.recordingDuration;
    
    // DOM элементы (будут инициализированы в init)
    this.container = null;
    this.messages = null;
    this.input = null;
    this.sendBtn = null;
    this.voiceBtn = null;
    this.header = null;
    this.toggleBtn = null;
    this.openBtn = null;
    this.inputArea = null;
    this.recordingIndicator = null;
    this.isMinimized = false;
    this.isRecording = false;
  }

  // Инициализация DOM элементов и привязка обработчиков
  SimpleChatbot.prototype.init = function() {
    var self = this;

    // Получаем DOM элементы
    this.container = document.getElementById('chatbot-container');
    this.messages = document.getElementById('chatbot-messages');
    this.input = document.getElementById('chatbot-input');
    this.sendBtn = document.getElementById('chatbot-send');
    this.voiceBtn = document.getElementById('chatbot-voice-btn');
    this.header = document.getElementById('chatbot-header');
    this.toggleBtn = document.getElementById('chatbot-toggle');
    this.openBtn = document.getElementById('chatbot-open-btn');
    this.inputArea = document.getElementById('chatbot-input-area');
    this.recordingIndicator = document.getElementById('chatbot-recording-indicator');

    // Проверяем, что все элементы найдены
    if (!this.container || !this.messages || !this.input || !this.sendBtn) {
      console.error('Chatbot: не найдены необходимые DOM элементы');
      return;
    }

    // Привязываем обработчики событий
    this.sendBtn.addEventListener('click', function() {
      self.handleSend();
    });

    this.input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        self.handleSend();
      }
    });

    // Обработчик кнопки голосового сообщения
    this.voiceBtn.addEventListener('click', function() {
      self.toggleRecording();
    });

    this.header.addEventListener('click', function(e) {
      if (e.target === self.header || e.target.tagName === 'SPAN') {
        self.toggleMinimize();
      }
    });

    this.toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      self.toggleMinimize();
    });

    this.openBtn.addEventListener('click', function() {
      self.restore();
    });

    // Фокус на поле ввода
    this.input.focus();
  };

  // Переключение режима записи
  SimpleChatbot.prototype.toggleRecording = function() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  };

  // Начало записи
  SimpleChatbot.prototype.startRecording = function() {
    var self = this;
    this.isRecording = true;
    
    // Визуальные эффекты
    this.voiceBtn.classList.add('recording');
    this.voiceBtn.textContent = '⏹';
    this.recordingIndicator.classList.add('active');
    
    // Блокируем поле ввода во время записи
    this.input.disabled = true;
    this.sendBtn.disabled = true;

    // Имитация записи через заданное время
    setTimeout(function() {
      self.stopRecording();
    }, this.recordingDuration);
  };

  // Остановка записи
  SimpleChatbot.prototype.stopRecording = function() {
    this.isRecording = false;
    
    // Возвращаем визуальные эффекты
    this.voiceBtn.classList.remove('recording');
    this.voiceBtn.textContent = '🎤';
    this.recordingIndicator.classList.remove('active');
    
    // Разблокируем поле ввода
    this.input.disabled = false;
    this.sendBtn.disabled = false;
    this.input.focus();

    // Добавляем голосовое сообщение в чат
    this.addVoiceMessage();
  };

  // Добавление голосового сообщения в чат
  SimpleChatbot.prototype.addVoiceMessage = function() {
    var self = this;
    
    // Создаём контейнер голосового сообщения
    var voiceEl = document.createElement('div');
    voiceEl.className = 'voice-message';
    
    // Генерируем случайную длительность (1-5 секунд)
    var duration = (Math.random() * 4 + 1).toFixed(1);
    
    // Создаём waveform (визуализация звука)
    var waveform = document.createElement('div');
    waveform.className = 'waveform';
    for (var i = 0; i < 5; i++) {
      var bar = document.createElement('span');
      waveform.appendChild(bar);
    }
    
    // Кнопка воспроизведения
    var playBtn = document.createElement('button');
    playBtn.className = 'play-btn';
    playBtn.textContent = '▶';
    playBtn.addEventListener('click', function() {
      // Имитация воспроизведения
      if (playBtn.textContent === '▶') {
        playBtn.textContent = '⏸';
        // Здесь можно добавить реальное воспроизведение аудио
      } else {
        playBtn.textContent = '▶';
      }
    });
    
    // Длительность
    var durationEl = document.createElement('span');
    durationEl.className = 'duration';
    durationEl.textContent = duration + ' сек';
    
    // Собираем элементы
    voiceEl.appendChild(playBtn);
    voiceEl.appendChild(waveform);
    voiceEl.appendChild(durationEl);
    
    this.messages.appendChild(voiceEl);
    this.scrollToBottom();

    // Имитация ответа бота на голосовое сообщение
    setTimeout(function() {
      self.showTyping();
      setTimeout(function() {
        self.hideTyping();
        self.addMessage('🎧 Хочется подарить икону, на которой святые равноапостольные Кирилл и Мефодий даруют письменность любителям голосовых сообщений. Ладно, будет возможность - прослушаю.', 'bot');
      }, self.typingDelay);
    }, 500);
  };

  // Обработка отправки текстового сообщения
  SimpleChatbot.prototype.handleSend = function() {
    var self = this;
    var text = this.input.value.trim();

    if (!text) {
      return;
    }

    // Добавляем сообщение пользователя
    this.addMessage(text, 'user');
    this.input.value = '';
    this.showTyping();

    // Имитация задержки ответа
    setTimeout(function() {
      self.hideTyping();
      var response = self.getBotResponse(text);
      self.addMessage(response, 'bot');
    }, this.typingDelay + Math.random() * 400);
  };

  // Получение ответа бота по ключевым словам
  SimpleChatbot.prototype.getBotResponse = function(userText) {
    var lowerText = userText.toLowerCase();
    var keys = Object.keys(this.keywords);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var phrases = this.keywords[key];

      for (var j = 0; j < phrases.length; j++) {
        if (lowerText.indexOf(phrases[j]) !== -1) {
          return this.responses[key] || this.defaultResponse;
        }
      }
    }

    return this.defaultResponse;
  };

  // Добавление текстового сообщения в чат
  SimpleChatbot.prototype.addMessage = function(text, sender) {
    var msgEl = document.createElement('div');
    msgEl.className = 'message ' + sender;
    msgEl.textContent = text;
    this.messages.appendChild(msgEl);
    this.scrollToBottom();
  };

  // Показ индикатора "Печатает..."
  SimpleChatbot.prototype.showTyping = function() {
    var typingEl = document.createElement('div');
    typingEl.className = 'typing';
    typingEl.id = 'chatbot-typing';
    typingEl.textContent = 'Печатает...';
    this.messages.appendChild(typingEl);
    this.scrollToBottom();
  };

  // Скрытие индикатора "Печатает..."
  SimpleChatbot.prototype.hideTyping = function() {
    var typing = document.getElementById('chatbot-typing');
    if (typing) {
      typing.parentNode.removeChild(typing);
    }
  };

  // Прокрутка к низу чата
  SimpleChatbot.prototype.scrollToBottom = function() {
    this.messages.scrollTop = this.messages.scrollHeight;
  };

  // Свёрнуть/развернуть чат
  SimpleChatbot.prototype.toggleMinimize = function() {
    this.isMinimized = !this.isMinimized;

    if (this.isMinimized) {
      this.messages.classList.add('minimized');
      this.inputArea.classList.add('minimized');
      this.header.classList.add('minimized');
      this.toggleBtn.textContent = '+';
      this.container.style.maxHeight = '50px';
      this.openBtn.style.display = 'flex';
    } else {
      this.restore();
    }
  };

  // Восстановление развёрнутого состояния
  SimpleChatbot.prototype.restore = function() {
    this.isMinimized = false;
    this.messages.classList.remove('minimized');
    this.inputArea.classList.remove('minimized');
    this.header.classList.remove('minimized');
    this.toggleBtn.textContent = 'свернуть';
    this.container.style.maxHeight = '450px';
    this.openBtn.style.display = 'none';
    this.input.focus();
  };

  // Публичный метод: добавить новую команду
  SimpleChatbot.prototype.addKeywordResponse = function(key, phrases, response) {
    this.keywords[key] = phrases;
    this.responses[key] = response;
  };

  // Публичный метод: изменить ответ по умолчанию
  SimpleChatbot.prototype.setDefaultResponse = function(text) {
    this.defaultResponse = text;
  };

  // Публичный метод: отправить сообщение программно
  SimpleChatbot.prototype.sendMessage = function(text) {
    var self = this;
    this.addMessage(text, 'user');
    setTimeout(function() {
      var response = self.getBotResponse(text);
      self.addMessage(response, 'bot');
    }, this.typingDelay);
  };

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
  // ============================================
  window.onload = function() {
    // Создаём экземпляр чат-бота
    window.chatbot = new SimpleChatbot({
      typingDelay: 700,
      recordingDuration: 2000,  // 2 секунды имитации записи
      defaultResponse: 'Ээээ... даже не знаю, что и ответить-то :('
    });

    // Инициализируем (привязываем обработчики, получаем DOM элементы)
    window.chatbot.init();

    // Пример: можно добавить дополнительные команды после инициализации
    // window.chatbot.addKeywordResponse('тест', ['тест', 'тест2'], 'можно чето добавить');
  };

})();