/**/ 
import React, { useState, useRef } from 'react';  
import './App.css';/*импорт зависимостей из библиотеки Реакт и импорт стилей*/ 


function ImageEditor() { /*компонент для редактирования изображения*/ 
  const [brightness, setBrightness] = useState(100); /*хранение уровня яркости и возможность задать новое*/ 
  const [imageURL, setImageURL] = useState(''); /*состояние пустой строки и функция вставки изображ. по URL*/ 
  const [processedImageURL, setProcessedImageURL] = useState(''); /*создание нового URL адреса после обработки*/ 
  const fileInputRef = useRef(null); /*ссылка для получения доступа к вставляемому элементу */ 

  const handleImageUpload = (e) => { /*функция обрабатывающая загрузку изображения*/ 
    const reader = new FileReader(); /*объект filereader дает доступ к чтению файла*/ 
    reader.onload = () => { /*обработчик будет вызван, когда чтение файла завершится успешно*/ 
      setImageURL(reader.result); /*храним результат чтения*/ 
      setProcessedImageURL(''); /*сброс предыдущего состояния*/ 
    };
    reader.readAsDataURL(e.target.files[0]); /*чтение файла*/ 
  };

  const handleBrightnessChange = (e) => {
    setBrightness(e.target.value); /*изменение яркости по значению из ползунка*/ 
  };

  const applyFilter = () => { /*применение фильтра по значению brightness*/ 
    const image = document.getElementById('uploaded-image');
    if (image) {
      image.style.filter = `brightness(${brightness}%)`;
    }
    generateProcessedImage(); /*создание обработанного изображения*/ 
  };

  const generateProcessedImage = () => {  /*обработка изображения*/ 
    const canvas = document.createElement('canvas'); /*элемент canvas для изменения графики*/ 
    const context = canvas.getContext('2d'); /*добавляем контекст 2d*/ 
    const image = document.getElementById('uploaded-image'); /*ссылка на элемент*/ 
    canvas.width = image.width;
    canvas.height = image.height; /*принимаются размеры изображения*/ 
    context.filter = `brightness(${brightness}%)`; /*устанавливается фильтр изменения яркости*/ 
    context.drawImage(image, 0, 0, image.width, image.height);/*изображение копируется на элемент canvas с помощью метода drawImage*/ 
    const processedImageURL = canvas.toDataURL('image/jpeg'); /*переводим изображение в тип данных URL*/ 
    setProcessedImageURL(processedImageURL);
  };

  const handleDownload = () => { /*загрузка обработанного изображения*/ 
    const link = document.createElement('a');
    link.href = processedImageURL; /*присваиваем ссылке обработанное изображение*/ 
    link.download = 'processed_image.jpg';
    link.click();
  };

  const handleReset = () => {
    setImageURL('');
    setProcessedImageURL(''); /*очистка обработанного изображения*/ 
    setBrightness(100); /*возвращаем настройки яркости к изначальным*/ 
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    /*разметка страницы*/ 
    <div className="container">
      <header className="header">
        <h1 className="logo">Редактор изображений</h1>
        <p className="tagline">Настройка яркости</p>
      </header>

      <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} />

      {imageURL && (
        <div>
          <img id="uploaded-image" src={imageURL} alt="Загруженное изображение" />

          <div>
            <label htmlFor="brightness">Яркость:</label>
            <input
              type="range"
              id="brightness"
              min="0"
              max="200"
              value={brightness}
              onChange={handleBrightnessChange}
            />
          </div>

          <div className="button-container">
            <button onClick={applyFilter}>Применить фильтр</button>
          </div>
        </div>
      )}

      {processedImageURL && (
        <div>
          <div className="button-container">
            <button onClick={handleDownload}>Скачать обработанное изображение</button>
            <button onClick={handleReset}>Редактировать новое изображение</button>
          </div>
        </div>
      )}

      <footer className="footer">
        <p className="advantages">
          <strong>Основные преимущества редактора изображений:</strong>
          <br />
          - Простой интерфейс использования
          <br />
          - Уменьшение или увеличение яркости
          <br />
          - Возможность скачать обработанные изображения
          <br />
        </p>
      </footer>
    </div>
  );
}

export default ImageEditor;
